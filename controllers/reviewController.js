const reviewService = require('../services/ReviewService')
const ErrorManager = require('../utils/error')

exports.addOneReview = async (req, res) => {
    try {
        const payload = { ...req.body, createdBy: req.user._id }
        // Si des images ont été uploadées, on stocke leur nom dans "pictures"
        if (req.files && req.files.pictures) {
            payload.pictures = req.files.pictures.map(file => file.filename)
        }
        const review = await reviewService.addOneReview(payload)
        res.status(201).json(review)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.findOneReviewById = async (req, res) => {
    try {
        const review = await reviewService.findOneReviewById(req.params.id, { error_not_found: true })
        res.json(review)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updateOneReviewById = async (req, res) => {
    try {
        const updatedReview = await reviewService.updateOneReviewById(req.params.id, req.body, {
            user: req.user,
            error_not_found: true,
        })
        res.json(updatedReview)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updatePictures = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({ message: 'No files uploaded.' })
        }

        const updatedReview = await reviewService.updatePictures(
            req.params.id,
            req.files
        )

        res.json(updatedReview)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.deleteOneReviewById = async (req, res) => {
    try {
        const deletedReview = await reviewService.deleteOneReviewById(req.params.id, {
            user: req.user,
            error_not_found: true,
        })
        res.json(deletedReview)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}