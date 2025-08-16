const express = require('express')
const router = express.Router()
const tagController = require('../controllers/tagController')
const isAdmin = require('../middlewares/isAdmin')

router.post('/', isAdmin, tagController.createTag)
router.get('/:id', tagController.getTagById)
router.get('/name/:name', tagController.getTagByName)
router.delete('/:id', isAdmin, tagController.deleteTagById)
router.delete('/name/:name', isAdmin, tagController.deleteTagByName)
router.put('/:id', isAdmin, tagController.updateTagById)
router.put('/name/:name', isAdmin, tagController.updateTagByName)
router.get('/category/:category', tagController.getTagsByCategory)

module.exports = router