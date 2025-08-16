const userService = require('../services/UserService')
const ErrorManager = require('../utils/error')


exports.getUserById = async (req, res) => {
    try {
        const user = await userService.findOneUserById(req.params.id, { error_not_found: true })
        res.json(user)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.getUserByUsername = async (req, res) => {
    try {
        const user = await userService.findOneUserByUsername(req.params.username, { error_not_found: true })
        res.json(user)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.createUser = async (req, res) => {
    try {
        const newUser = await userService.addOneUser(req.body)
        if (req.file) {
            payload.profilePicture = req.file.filename
        }
        res.status(201).json(newUser)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.deleteUserById = async (req, res) => {
    try {
        const deleted = await userService.deleteOneUserById(req.params.id, { error_not_found: true })
        res.json(deleted)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.deleteUserByUsername = async (req, res) => {
    try {
        const deleted = await userService.deleteOneUserByUsername(req.params.username, { error_not_found: true })
        res.json(deleted)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updateUserById = async (req, res) => {
    try {
        const updated = await userService.updateOneUserById(req.params.id, req.body, { error_not_found: true })
        res.json(updated)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updateUserByUsername = async (req, res) => {
    try {
        const updated = await userService.updateOneUserByUsername(req.params.username, req.body, { error_not_found: true })
        res.json(updated)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.updateProfilePicture = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded.' })
        }

        const updatedUser = await userService.updateProfilePicture(
            req.params.id,
            req.file
        )

        res.json(updatedUser)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.addToFriendlist = async (req, res) => {
    try {
        const userId = req.user._id
        const { friendId } = req.body

        const user = await userService.addToFriendlist(userId, friendId, { error_not_found: true })
        res.json(user)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.removeFromFriendlist = async (req, res) => {
    try {
        const userId = req.user._id
        const { friendId } = req.body

        const user = await userService.removeFromFriendlist(userId, friendId, { error_not_found: true })
        res.json(user)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.addToWishlist = async (req, res) => {
    try {
        const userId = req.user._id
        const { experienceId } = req.body

        const user = await userService.addToWishlist(userId, experienceId, { error_not_found: true })
        res.json(user)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.removeFromWishlist = async (req, res) => {
    try {
        const userId = req.user._id
        const { experienceId } = req.body

        const user = await userService.removeFromWishlist(userId, experienceId, { error_not_found: true })
        res.json(user)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}