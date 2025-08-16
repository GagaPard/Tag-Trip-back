const express = require('express')
const router = express.Router()
const reviewController = require('../controllers/reviewController')
const pictureUploader = require('../middlewares/pictureUpload')

const uploadReviewPictures = pictureUploader('reviews', [ { name: 'pictures', maxCount: 3 } ], 5)

router.post(
    '/', 
    uploadReviewPictures,
    reviewController.addOneReview)
router.get('/:id', reviewController.findOneReviewById)
router.put(
    '/:id', 
    uploadReviewPictures,
    reviewController.updateOneReviewById)
router.delete('/:id', reviewController.deleteOneReviewById)

module.exports = router