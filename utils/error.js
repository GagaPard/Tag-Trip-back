const mongoose = require('mongoose')

let createValidationFieldsError = function (error, options) {
    let keys_error = Object.keys(error.errors) 
    let error_formated = error.errors 
    let object_error = {}
    keys_error.forEach((element) => {
        object_error[element] = error_formated[element].message
    })
    return object_error
}

// Normalise les différents types d'erreurs mongoose en un format commun
let parsingMongooseError = function (error, options) {
    if (error instanceof mongoose.Error.ValidationError) {
        const hasCastError = Object.values(error.errors).some(
            err => err instanceof mongoose.Error.CastError
        )
        const field_errors = createValidationFieldsError(error, options)

        for (let field in field_errors) {
            const err = error.errors[field]
            
            //Cas du mdp trop court (Mongoose renvoie la valeur du mdp autrement)
            if (field === 'password' && err && err.kind === 'minlength') {
                field_errors[field] = 'Password is too short (12 characters minimum are required).'
            }

            //Cas des enums
            if (err.kind === 'enum' && err.properties.enumValues) {
                const allowedValues = err.properties.enumValues.join(', ')
                field_errors[field] = `Invalid value for '${field}'. Allowed values are: ${allowedValues}.`
            }

            //Cas des castError imbriqués
            if (err instanceof mongoose.Error.CastError) {
                field_errors[field] = `Invalid value provided for field "${field}". Expected type: ${err.kind}.`
            }
        }

        return {
            type: hasCastError ? 'NOT_VALID_CAST' : 'NOT_VALID',
            message: hasCastError
            ? 'One or more fields do not have the correct format.'
            : 'The schema is incorrect',
            fields: field_errors
        }
        /*  {fields: { <champ en erreur>: 'Le champ est requis' }}  */
    }

    else if (error && error.code == 11000) {
        // Doublon d'un champ unique (le code 11000 est envoyé par MongoDB et non par mongoose, il faut le traiter autrement)
        const fields = error.keyValue
        const maskedFields = {}

        // Masquer les valeurs, mais conserver la clé
        for (let key in fields) {
            maskedFields[key] = 'Value is not unique.'
        }

        return { type: 'DUPLICATE', message: "One or more fields are not unique.", fields: maskedFields }
    }
    
    else if (error instanceof mongoose.Error.CastError) {
        // Problème de conversion d'un champ, type non adapté pour la value du field (ex: ObjectId invalide)
        const field = error.path
        return {
            type: 'NOT_VALID_CAST',
            message: 'One or more fields do not have the correct format.',
            fields: {
                [field]: `Invalid value provided for field "${field}". Expected type: ${error.kind}.`
            }
        }
    }

    else if (error instanceof mongoose.Error && error.message.includes('is not in schema and strict mode is set to throw')) {
        const match = error.message.match(/Field `(.*?)` is not in schema/)
        let field = 'unknown'
        if (match && match[1]) {
            field = match[1]
        }
        return {
            type: 'NOT_VALID',
            message: 'One or more fields are not allowed by the schema.',
            fields: {
                [field]: `Field '${field}' is not defined in the schema.`
            }
        }
    }
    console.log("Unhandled error case.")
    return error
}

module.exports.parsingError = function (error, options) {
    //Si erreur déjà formatée dans le service (NOT_FOUND)
    if (error && error.type) {
        return error
    }
    if ((error instanceof mongoose.Error) || (error && error.code == 11000)) {
        return parsingMongooseError(error, options)
    }
    console.log("Unhandled error case.")
    return error
}

module.exports.handleErrorResponse = function (err, res) {
    console.error('[ERROR]', err)

    if (err.type === 'NOT_FOUND') {
        return res.status(404).json({ message: err.message, fields: err.fields })
    }

    if (err.type === 'DUPLICATE') {
        return res.status(409).json({ message: err.message, fields: err.fields })
    }

    if (err.type === 'NOT_VALID' || err.type === 'NOT_VALID_CAST') {
        return res.status(400).json({ message: err.message, fields: err.fields })
    }

    res.status(500).json({ message: 'Internal Server Error.' })
}