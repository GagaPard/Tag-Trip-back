const Experience = require('../schemas/Experience')

const ErrorManager = require('../utils/error')

module.exports.addOneExperience = async function (payload, options = null) {
    try {
        let newExperience = new Experience(payload)
        let save = await newExperience.save()
        return save
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneExperienceById = async function (id, options = null) {
    try {
        let finded = await Experience.findById(id)
        if (options && options.error_not_found && !finded) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'Experience not found.' }
        }
        return finded
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.findOneExperienceByName = async function (name, options = null) {
    try {
        let finded = await Experience.findOne({ name })
        if (options && options.error_not_found && !finded) {
            // Erreur personnalisée si demandé
            throw { type: 'NOT_FOUND', message: 'Experience not found.' }
        }
        return finded
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.deleteOneExperienceById = async function (id, options = null) {
    try {
        let deleted = await Experience.findOneAndDelete( { _id: id } )
        if (options && options.error_not_found && !deleted) {
            throw { type: 'NOT_FOUND', message: 'Experience not found.' }
        }
        return deleted
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.deleteOneExperienceByName = async function (name, options = null) {
    try {
        let deleted = await Experience.findOneAndDelete({ name })
        if (options && options.error_not_found && !deleted) {
            throw { type: 'NOT_FOUND', message: 'Experience not found.' }
        }
        return deleted
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneExperienceById = async function (id, update, options = null) {
    try {
        let updated = await Experience.findByIdAndUpdate(id, update, { returnDocument: 'after', runValidators: true })
        if (options && options.error_not_found && !updated) {
            throw { type: 'NOT_FOUND', message: 'Experience not found.' }
        }
        return updated
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updateOneExperienceByName = async function (name, update, options = null) {
    try {
        let updated = await Experience.findOneAndUpdate({ name }, update, { returnDocument: 'after', runValidators: true })
        if (options && options.error_not_found && !updated) {
            throw { type: 'NOT_FOUND', message: 'Experience not found.' }
        }
        return updated
    }
    catch (err) {
        throw (ErrorManager.parsingError(err))
    }
}

module.exports.updatePictures = async function (id, files) {
    try {
        const experience = await Experience.findById(id)
        if (!experience) {
            throw { type: 'NOT_FOUND', message: 'Experience not found.' }
        }

        // Supprimer toutes les anciennes photos
        if (Array.isArray(experience.pictures) && experience.pictures.length > 0) {
            experience.pictures.forEach(picture => {
                const oldPath = path.join(__dirname, '..', 'uploads', 'experiences', picture)
                if (fs.existsSync(oldPath)) {
                    fs.unlinkSync(oldPath)
                }
            })
        }

        // Enregistrer les nouvelles photos
        const filenames = files.map(file => file.filename)
        experience.pictures = filenames

        await experience.save()
        return experience
    } catch (err) {
        throw ErrorManager.parsingError(err)
    }
}

module.exports.getExperiencesNameByCategory = async function (category, options = null) {
    const validCategories = ['Restaurant', 'Activité', 'Hébergement']

    if (!validCategories.includes(category)) {
        throw { type: 'INVALID_CATEGORY', message: `Invalid category: ${category}` }
    }

    const experiences = await Experience.find({ experienceCategory: category }).select('name -_id')
    return experiences.map(experience => experience.name)
}

/*  
Utiliser la fonction :
    await findExperiences({
    city: "cityName",
    country: "countryName",
    tags: [
        "tag_id",
        "tag_id"
    ]
    }) 
*/

module.exports.findExperiences = async function (filters = {}) {
    const query = {}

    const allFilters = []

    if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
        allFilters.push({
            tags: { $all: filters.tags }
        })
    }

    if (filters.city) {
        allFilters.push({
            'adress.city': filters.city
        })
    }

    if (filters.country) {
        allFilters.push({
            'adress.country': filters.country
        })
    }

    if (allFilters.length > 0) {
        query.$and = allFilters
    }

    const experiences = await Experience.find(query)

    return experiences
}