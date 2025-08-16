const express = require('express')
const router = express.Router()
const experienceController = require('../controllers/experienceController')
const pictureUploader = require('../middlewares/pictureUpload')

const uploadExpPictures = pictureUploader('experiences', [ { name: 'pictures', maxCount: 3 } ], 5)

router.get('/:id', experienceController.getExperienceById)
router.get('/name/:name', experienceController.getExperienceByName)
router.post(
    '/', 
    uploadExpPictures,
    experienceController.createExperience)
router.delete('/:id', experienceController.deleteExperienceById)
router.delete('/name/:name', experienceController.deleteExperienceByName)
router.put('/:id', experienceController.updateExperienceById)
router.put('/name/:name', experienceController.updateExperienceByName)
router.get('/category/:category', experienceController.getExperiencesByCategory)
router.post('/find', experienceController.findExperiences)

router.put(
    '/:id/pictures',
    uploadExpPictures,
    experienceController.updatePictures
)

module.exports = router