const express = require('express');
const router = express.Router();
const parser = require('../middleware/upload');
const blogController = require('../controllers/blogController');

router.post('/', parser.single('image'), blogController.createBlog);
router.get('/', blogController.getBlogs);
router.get('/:id', blogController.getBlogById);
router.put('/:id', parser.single('image'), blogController.updateBlog);
router.delete('/:id', blogController.deleteBlog);

module.exports = router;
