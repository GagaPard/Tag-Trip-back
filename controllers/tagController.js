const tagService = require('../services/TagService')
const ErrorManager = require('../utils/error')

exports.createTag = async (req, res) => {
    try {
        const tag = await tagService.addOneTag(req.body)
        res.status(201).json(tag)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.getTagById = async (req, res) => {
    try {
        const tag = await tagService.findOneTagById(req.params.id, { error_not_found: true })
        res.json(tag)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.getTagByName = async (req, res) => {
    try {
        const tag = await tagService.findOneTagByName(req.params.name, { error_not_found: true })
        res.json(tag)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.deleteTagById = async (req, res) => {
    try {
        const deleted = await tagService.deleteOneTagById(req.params.id, { error_not_found: true })
        res.json(deleted)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.deleteTagByName = async (req, res) => {
    try {
        const deleted = await tagService.deleteOneTagByName(req.params.name, { error_not_found: true })
        res.json(deleted)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updateTagById = async (req, res) => {
    try {
        const updated = await tagService.updateOneTagById(req.params.id, req.body, { error_not_found: true })
        res.json(updated)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updateTagByName = async (req, res) => {
    try {
        const updated = await tagService.updateOneTagByName(req.params.name, req.body, { error_not_found: true })
        res.json(updated)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.getTagsByCategory = async (req, res) => {
    try {
        const tags = await tagService.getTagsNameByCategory(req.params.category)
        res.json(tags)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}