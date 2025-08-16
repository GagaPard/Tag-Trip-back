const tripService = require('../services/TripService')
const ErrorManager = require('../utils/error')

exports.addOneTrip = async (req, res) => {
    try {
        const payload = { ...req.body, createdBy: req.user._id } // Assure-toi que l’utilisateur est bien associé
        if (req.file) {
            payload.picture = req.file.filename
        }
        const trip = await tripService.addOneTrip(payload)
        res.status(201).json(trip)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.findOneTripById = async (req, res) => {
    try {
        const trip = await tripService.findOneTripById(req.params.id, { error_not_found: true })
        res.json(trip)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updateOneTripById = async (req, res) => {
    try {
        const updatedTrip = await tripService.updateOneTripById(req.params.id, req.body, {
            user: req.user,
            error_not_found: true,
        })
        res.json(updatedTrip)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updatePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' })
        }

        const updatedTrip = await tripService.updatePicture(
            req.params.id,
            req.file
        )

        res.json(updatedTrip)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.deleteOneTripById = async (req, res) => {
    try {
        const deletedTrip = await tripService.deleteOneTripById(req.params.id, {
            user: req.user,
            error_not_found: true,
        })
        res.json(deletedTrip)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}