const express = require('express')
const router = express.Router()
const authController = require('../controllers/authController')
const pictureUploader = require('../middlewares/pictureUpload')

const uploadPP = pictureUploader('profiles', [ { name: 'profilePicture', maxCount: 1 } ], 2)

router.post(
    '/register',
    uploadPP,
    authController.register)
router.post('/login', authController.login)

module.exports = router