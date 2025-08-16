const express = require('express')
const userController = require('../controllers/userController')
const router = express.Router()
const pictureUploader = require('../middlewares/pictureUpload')

const uploadPP = pictureUploader('profiles', [ { name: 'profilePicture', maxCount: 1 } ], 2)

router.get('/:id', userController.getUserById)
router.get('/username/:username', userController.getUserByUsername)
router.post(
    '/',
    uploadPP,
    userController.createUser)
router.delete('/:id', userController.deleteUserById)
router.delete('/username/:username', userController.deleteUserByUsername)
router.put('/:id', userController.updateUserById)
router.put('/username/:username', userController.updateUserByUsername)

router.post('/friendlist', userController.addToFriendlist)
router.delete('/friendlist', userController.removeFromFriendlist)

router.post('/wishlist', userController.addToWishlist)
router.delete('/wishlist', userController.removeFromWishlist)

router.put(
    '/:id/profile-picture',
    uploadPP,
    userController.updateProfilePicture
)

module.exports = router