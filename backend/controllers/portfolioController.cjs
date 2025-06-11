const Portfolio = require('../models/Portfolio.cjs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createPortfolio = async (req, res) => {
  const { title, description, category } = req.body;
  const imageUrl = req.file ? req.file.path : null; // Multer adds file info to req.file

  try {
    let uploadedImageUrl = '';
    if (imageUrl) {
      const result = await cloudinary.uploader.upload(imageUrl);
      uploadedImageUrl = result.secure_url;
    }

    const newPortfolio = new Portfolio({
      title,
      description,
      imageUrl: uploadedImageUrl,
      category,
    });

    const portfolio = await newPortfolio.save();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find();
    res.json(portfolios);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getPortfolioById = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updatePortfolio = async (req, res) => {
  const { title, description, category } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  try {
    let portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }

    if (imageUrl) {
      // Delete old image from Cloudinary if it exists
      if (portfolio.imageUrl) {
        const publicId = portfolio.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(imageUrl);
      portfolio.imageUrl = result.secure_url;
    }

    portfolio.title = title || portfolio.title;
    portfolio.description = description || portfolio.description;
    portfolio.category = category || portfolio.category;

    await portfolio.save();
    res.json(portfolio);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }

    // Delete image from Cloudinary
    if (portfolio.imageUrl) {
      const publicId = portfolio.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await Portfolio.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Portfolio removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};