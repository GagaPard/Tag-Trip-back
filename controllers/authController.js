const User = require('../schemas/User')
const userService = require('../services/UserService')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const ErrorManager = require('../utils/error')


exports.register = async (req, res) => {
    try {
        const payload = { ...req.body }

        // Si une image a été uploadée, on stocke son nom dans profilePicture
        if (req.files && req.files.profilePicture && req.files.profilePicture[0]) {
            payload.profilePicture = req.files.profilePicture[0].filename
        }

        payload.password = await bcrypt.hash(payload.password, 10)

        const user = await userService.addOneUser(payload)
        res.status(201).json(user)
    } catch (err) {
        ErrorManager.handleErrorResponse(err, res)
    }
}

exports.login = async (req, res) => {
    try {
        const { email, password } = req.body

        const user = await User.findOne({ email })
        if (!user) {
            return res.status(404).json({ message: "This email isn't used." })
        }

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid password.' })
        }

        const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: '1d' })

        res.json({ token: 'Bearer ' + token })
    } catch (err) {
        res.status(500).json({ error: err.message })
    }
}
