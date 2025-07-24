const mongoose = require('mongoose')
const UserSchema = require('../schemas/User')

const User = mongoose.model('User', UserSchema)

const ErrorManager = require('../utils/error')

module.exports.addOneUser = async function (payload, options = null) {
    try {
        let newUser = new User(payload)
        let save = await newUser.save()
        return save
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneUserById = async function (id, options = null) {
    try {
        let finded = await User.findById(id)
        if (options && options.error_not_found && !finded) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'Utilisateur non trouvé.' }
        }
        return finded
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneUserByUsername = async function (username, options = null) {
    try {
        let finded = await User.findOne({ username })
        if (options && options.error_not_found && !finded) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'Utilisateur non trouvé.' }
        }
        return finded
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.deleteOneUserById = async function (id, options = null) {
    try {
        let deleted = await User.findByIdAndDelete(id)
        if (options && options.error_not_found && !deleted) {
            throw { type: 'NOT_FOUND', message: 'Utilisateur non trouvé.' }
        }
        return deleted
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.deleteOneUserByUsername = async function (username, options = null) {
    try {
        let deleted = await User.findOneAndDelete({ username })
        if (options && options.error_not_found && !deleted) {
            throw { type: 'NOT_FOUND', message: 'Utilisateur non trouvé.' }
        }
        return deleted
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneUserById = async function (id, update, options = null) {
    try {
        let updated = await User.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true })
        if (options && options.error_not_found && !updated) {
            throw { type: 'NOT_FOUND', message: 'Utilisateur non trouvé.' }
        }
        return updated
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneUserByUsername = async function (username, update, options = null) {
    try {
        let updated = await User.findOneAndUpdate({ username }, update, { returnDocument: 'after', runValidators: true })
        if (options && options.error_not_found && !updated) {
            throw { type: 'NOT_FOUND', message: 'Utilisateur non trouvé.' }
        }
        return updated
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}