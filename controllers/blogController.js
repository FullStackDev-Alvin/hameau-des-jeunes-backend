const Blog = require('../models/Blog');
const cloudinary = require('../config/cloudinaryConfig');

exports.createBlog = async (req, res) => {
  try {
    const { title, content } = req.body;
    if (!title || !content)
      return res.status(400).json({ message: 'Title and content required' });

    let imageUrl = null;
    let imagePublicId = null;
    if (req.file) {
      imageUrl = req.file.path;
      imagePublicId = req.file.filename;
    }

    const blog = new Blog({
      title,
      content,
      imageUrl,
      imagePublicId,
    });

    await blog.save();

    res.status(201).json({ message: 'Blog created', blog });
  } catch (error) {
    console.error('createBlog error:', error);
    res.status(500).json({ error: 'Failed to create blog' });
  }
};

exports.getBlogs = async (req, res) => {
  try {
    const blogs = await Blog.find().sort({ createdAt: -1 });
    res.json(blogs);
  } catch (error) {
    console.error('getBlogs error:', error);
    res.status(500).json({ error: 'Failed to fetch blogs' });
  }
};

exports.getBlogById = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });
    res.json(blog);
  } catch (error) {
    console.error('getBlogById error:', error);
    res.status(500).json({ error: 'Failed to fetch blog' });
  }
};

exports.updateBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog) return res.status(404).json({ message: 'Blog not found' });

    const { title, content } = req.body;
    if (title) blog.title = title;
    if (content) blog.content = content;

    if (req.file) {
      if (blog.imagePublicId) {
        await cloudinary.uploader.destroy(blog.imagePublicId);
      }
      blog.imageUrl = req.file.path;
      blog.imagePublicId = req.file.filename;
    }

    blog.updatedAt = new Date();

    await blog.save();

    res.json({ message: 'Blog updated', blog });
  } catch (error) {
    console.error('updateBlog error:', error);
    res.status(500).json({ error: 'Failed to update blog' });
  }
};

exports.deleteBlog = async (req, res) => {
  try {
    const blog = await Blog.findById(req.params.id);
    if (!blog)
      return res.status(404).json({ message: 'Blog not found' });

    if (blog.imagePublicId) {
      try {
        // Attempt to delete image from Cloudinary
        await cloudinary.uploader.destroy(blog.imagePublicId);
      } catch (cloudErr) {
        console.error('Cloudinary deletion error:', cloudErr);
        // Decide: continue anyway or return error - here we continue
      }
    }

    // Use deleteOne instead of remove
    await blog.deleteOne();

    res.json({ message: 'Blog deleted successfully' });
  } catch (error) {
    console.error('deleteBlog error:', error);
    res.status(500).json({ error: 'Failed to delete blog' });
  }
};

