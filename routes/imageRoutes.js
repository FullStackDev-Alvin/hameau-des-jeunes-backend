const express = require('express');
const router = express.Router();
const parser = require('../middleware/upload');
const imageController = require('../controllers/imageController');

router.post('/upload', parser.array('images', 20), imageController.uploadImages);
router.delete('/:id', imageController.deleteImage);
router.get('/', imageController.getAllImages);

module.exports = router;
