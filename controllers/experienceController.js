const experienceService = require('../services/ExperienceService')
const ErrorManager = require('../utils/error')

exports.getExperienceById = async (req, res) => {
    try {
        const experience = await experienceService.findOneExperienceById(req.params.id, { error_not_found: true })
        res.json(experience)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.getExperienceByName = async (req, res) => {
    try {
        const experience = await experienceService.findOneExperienceByName(req.params.name, { error_not_found: true })
        res.json(experience)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.createExperience = async (req, res) => {
    try {
        const payload = { ...req.body }

        // Si des images ont été uploadées, on stocke leur nom dans "pictures"
        if (req.files && req.files.pictures) {
            payload.pictures = req.files.pictures.map(file => file.filename)
        }

        const newExperience = await experienceService.addOneExperience(payload)
        res.status(201).json(newExperience)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.deleteExperienceById = async (req, res) => {
    try {
        const deleted = await experienceService.deleteOneExperienceById(req.params.id, { error_not_found: true })
        res.json(deleted)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.deleteExperienceByName = async (req, res) => {
    try {
        const deleted = await experienceService.deleteOneExperienceByName(req.params.name, { error_not_found: true })
        res.json(deleted)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updateExperienceById = async (req, res) => {
    try {
        const updated = await experienceService.updateOneExperienceById(req.params.id, req.body, { error_not_found: true })
        res.json(updated)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updateExperienceByName = async (req, res) => {
    try {
        const updated = await experienceService.updateOneExperienceByName(req.params.name, req.body, { error_not_found: true })
        res.json(updated)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updatePictures = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' })
        }

        const updatedExperience = await experienceService.updatePictures(
            req.params.id,
            req.files
        )

        res.json(updatedExperience)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.getExperiencesByCategory = async (req, res) => {
    try {
        const category = req.params.category
        const experiences = await experienceService.getExperiencesNameByCategory(category)
        res.json(experiences)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.findExperiences = async (req, res) => {
    try {
        const filters = req.body || {}
        const experiences = await experienceService.findExperiences(filters)
        res.json(experiences)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}