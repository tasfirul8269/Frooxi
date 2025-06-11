import express from 'express';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import Portfolio from '../models/Portfolio.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage: storage });

// @route   POST api/portfolio
// @desc    Create a portfolio item
// @access  Private (Admin only)
router.post('/', [auth, adminAuth], async (req, res) => {
  try {
    const { title, description, image, category, technologies, link } = req.body;

    // Create new portfolio
    const portfolio = new Portfolio({
      title,
      description,
      image,
      category,
      technologies: Array.isArray(technologies) ? technologies : technologies.split(',').map(tech => tech.trim()),
      link
    });

    // Save to database
    await portfolio.save();

    res.json(portfolio);
  } catch (err) {
    console.error('Portfolio creation error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET api/portfolio
// @desc    Get all portfolio items
// @access  Public
router.get('/', async (req, res) => {
  try {
    const portfolios = await Portfolio.find().sort({ createdAt: -1 });
    res.json(portfolios);
  } catch (err) {
    console.error('Get portfolios error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET api/portfolio/:id
// @desc    Get portfolio item by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);
    
    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }

    res.json(portfolio);
  } catch (err) {
    console.error('Get portfolio error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   PUT api/portfolio/:id
// @desc    Update portfolio item
// @access  Private (Admin only)
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { title, description, image, category, technologies, link } = req.body;

    // Build portfolio object
    const portfolioFields = {
      title,
      description,
      image,
      category,
      technologies: Array.isArray(technologies) ? technologies : technologies.split(',').map(tech => tech.trim()),
      link
    };

    let portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }

    // Update portfolio
    portfolio = await Portfolio.findByIdAndUpdate(
      req.params.id,
      { $set: portfolioFields },
      { new: true }
    );

    res.json(portfolio);
  } catch (err) {
    console.error('Update portfolio error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   DELETE api/portfolio/:id
// @desc    Delete portfolio item
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const portfolio = await Portfolio.findById(req.params.id);

    if (!portfolio) {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }

    await portfolio.deleteOne();

    res.json({ msg: 'Portfolio deleted' });
  } catch (err) {
    console.error('Delete portfolio error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Portfolio not found' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

export default router; 