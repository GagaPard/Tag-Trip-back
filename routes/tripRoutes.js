const express = require('express')
const router = express.Router()
const tripController = require('../controllers/tripController')
const pictureUploader = require('../middlewares/pictureUpload')

const uploadTripPicture = pictureUploader('reviews', [ { name: 'picture', maxCount: 1 } ], 5)

router.post(
    '/', 
    uploadTripPicture,
    tripController.addOneTrip)
router.get('/:id', tripController.findOneTripById)
router.put(
    '/:id',
    uploadTripPicture,
    tripController.updateOneTripById)
router.delete('/:id', tripController.deleteOneTripById)

module.exports = router