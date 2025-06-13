import Portfolio from '../models/Portfolio.js';
import cloudinary from '../config/cloudinary.js';

// @desc    Get all portfolio items
// @route   GET /api/portfolio
// @access  Public
export const getPortfolios = async (req, res) => {
  try {
    const portfolios = await Portfolio.find({ isActive: true })
      .sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (err) {
    console.error('Error fetching portfolios:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Get single portfolio item
// @route   GET /api/portfolio/:id
// @access  Public
export const getPortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.json(portfolio);
  } catch (err) {
    console.error('Error fetching portfolio:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Create portfolio item
// @route   POST /api/portfolio
// @access  Private/Admin
export const createPortfolio = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      technologies,
      client,
      projectUrl
    } = req.body;

    // Get image URL from Cloudinary upload
    const imageUrl = req.file ? req.file.path : null;

    if (!imageUrl) {
      return res.status(400).json({ msg: 'Image is required' });
    }

    const portfolio = new Portfolio({
      title,
      description,
      imageUrl,
      category,
      technologies: technologies ? JSON.parse(technologies) : [],
      client,
      projectUrl
    });

    await portfolio.save();
    res.status(201).json(portfolio);
  } catch (err) {
    console.error('Error creating portfolio:', err);
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Update portfolio item
// @route   PUT /api/portfolio/:id
// @access  Private/Admin
export const updatePortfolio = async (req, res) => {
  try {
    const {
      title,
      description,
      category,
      technologies,
      client,
      projectUrl,
      isActive
    } = req.body;

    let portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }

    // If new image is uploaded, delete old image from Cloudinary
    if (req.file) {
      const oldImagePublicId = portfolio.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(oldImagePublicId);
    }

    const updateData = {
      title,
      description,
      category,
      technologies: technologies ? JSON.parse(technologies) : portfolio.technologies,
      client,
      projectUrl,
      isActive
    };

    // Add new image URL if uploaded
    if (req.file) {
      updateData.imageUrl = req.file.path;
    }

    portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    res.json(portfolio);
  } catch (err) {
    console.error('Error updating portfolio:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
};

// @desc    Delete portfolio item
// @route   DELETE /api/portfolio/:id
// @access  Private/Admin
export const deletePortfolio = async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }

    // Delete image from Cloudinary
    const imagePublicId = portfolio.imageUrl.split('/').pop().split('.')[0];
    await cloudinary.uploader.destroy(imagePublicId);

    await portfolio.deleteOne();
    res.json({ msg: 'Portfolio removed' });
  } catch (err) {
    console.error('Error deleting portfolio:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
}; 