const Image = require('../models/Image');
const cloudinary = require('../config/cloudinaryConfig');

exports.uploadImages = async (req, res) => {
  try {
    if (!req.files || req.files.length === 0)
      return res.status(400).json({ message: 'No images uploaded' });

    const images = await Promise.all(
      req.files.map(async (file) => {
        const newImage = new Image({
          url: file.path,
          public_id: file.filename,
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
