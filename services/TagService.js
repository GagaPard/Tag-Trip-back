const Tag = require('../schemas/Tag')

const ErrorManager = require('../utils/error')

module.exports.addOneTag = async function (payload, options = null) {
    try {
        let newTag = new Tag(payload)
        let save = await newTag.save()
        return save
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneTagById = async function (id, options = null) {
    try {
        let finded = await Tag.findById(id)
        if (options && options.error_not_found && !finded) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'Tag not found.' }
        }
        return finded
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneTagByName = async function (name, options = null) {
    try {
        let finded = await Tag.findOne({ name })
        if (options && options.error_not_found && !finded) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'Tag not found.' }
        }
        return finded
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.deleteOneTagById = async function (id, options = null) {
    try {
        let deleted = await Tag.findOneAndDelete( { _id: id } )
        if (options && options.error_not_found && !deleted) {
            throw { type: 'NOT_FOUND', message: 'Tag not found.' }
        }
        return deleted
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.deleteOneTagByName = async function (name, options = null) {
    try {
        let deleted = await Tag.findOneAndDelete({ name })
        if (options && options.error_not_found && !deleted) {
            throw { type: 'NOT_FOUND', message: 'Tag not found.' }
        }
        return deleted
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneTagById = async function (id, update, options = null) {
    try {
        let updated = await Tag.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true })
        if (options && options.error_not_found && !updated) {
            throw { type: 'NOT_FOUND', message: 'Tag not found.' }
        }
        return updated
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneTagByName = async function (name, update, options = null) {
    try {
        let updated = await Tag.findOneAndUpdate({ name }, update, { returnDocument: 'after', runValidators: true })
        if (options && options.error_not_found && !updated) {
            throw { type: 'NOT_FOUND', message: 'Tag not found.' }
        }
        return updated
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.getTagsNameByCategory = async function (category, options = null) {
    const validCategories = ['Culture', 'Restauration', 'Hébergement', 'Paysages', 'Activités', 'Accessibilité']

    if (!validCategories.includes(category)) {
        throw { type: 'INVALID_CATEGORY', message: `Invalid category: ${category}` }
    }

    const tags = await Tag.find({ tagCategory: category }).select('name -_id')
    return tags.map(tag => tag.name)
}