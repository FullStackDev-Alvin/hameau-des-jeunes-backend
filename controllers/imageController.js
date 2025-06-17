const Image = require('../models/Image');
const cloudinary = require('../config/cloudinaryConfig');

exports.uploadImages = async (req, res) => {
  try {
    const category = req.body.category;
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No images uploaded' });

    const images = await Promise.all(
      req.files.map(async (file) => {
        const newImage = new Image({
          url: file.path,
          public_id: file.filename,
          category: category,
        });
        await newImage.save();
        return newImage;
      })
    );

    res.status(201).json({ message: 'Images uploaded successfully', images });
  } catch (error) {
    console.error('uploadImages error:', error);
    res.status(500).json({ error: 'Failed to upload images' });
  }
};

exports.deleteImage = async (req, res) => {
  try {
    const image = await Image.findById(req.params.id);
    if (!image) return res.status(404).json({ message: 'Image not found' });
    await cloudinary.uploader.destroy(image.public_id);
    await Image.deleteOne({ _id: image._id }); // Use deleteOne instead of remove
    res.json({ message: 'Image deleted successfully' });
  } catch (error) {
    console.error('deleteImage error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
};
exports.getAllImages = async (req, res) => {
  try {
    const images = await Image.find().sort({ uploadedAt: -1 });
    res.json(images);
  } catch (error) {
    console.error('getAllImages error:', error);
    res.status(500).json({ error: 'Failed to fetch images' });
  }
};
exports.getImagesByCategory = async (req, res) => {
  try {
    const category = req.params.category;

    const images = await Image.find({ category }).sort({ uploadedAt: -1 });

    if (images.length === 0) {
      return res.status(404).json({ message: 'No images found for this category' });
    }

    res.json(images);
  } catch (error) {
    console.error('getImagesByCategory error:', error);
    res.status(500).json({ error: 'Failed to fetch images by category' });
  }
};

exports.deleteAllImages = async (req, res) => {
  try {
    const images = await Image.find();

    if (images.length === 0) {
      return res.status(404).json({ message: 'No images found to delete' });
    }

    // Delete each image from Cloudinary
    await Promise.all(
      images.map(async (image) => {
        await cloudinary.uploader.destroy(image.public_id);
      })
    );

    // Delete all images from MongoDB
    await Image.deleteMany({});

    res.json({ message: 'All images deleted successfully' });
  } catch (error) {
    console.error('deleteAllImages error:', error);
    res.status(500).json({ error: 'Failed to delete all images' });
  }
};
