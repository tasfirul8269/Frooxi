const express = require('express');
const router = express.Router();
const portfolioController = require('../controllers/portfolioController.cjs');
const auth = require('../middleware/auth.cjs');
const adminAuth = require('../middleware/adminAuth.cjs');
const multer = require('multer');

// Set up multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/'); // Make sure this uploads directory exists
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});
const upload = multer({ storage: storage });

// @route   POST api/portfolio
// @desc    Create a portfolio item
// @access  Private (Admin only)
router.post('/', [auth, adminAuth, upload.single('image')], portfolioController.createPortfolio);

// @route   GET api/portfolio
// @desc    Get all portfolio items
// @access  Public
router.get('/', portfolioController.getPortfolios);

// @route   GET api/portfolio/:id
// @desc    Get portfolio item by ID
// @access  Public
router.get('/:id', portfolioController.getPortfolioById);

// @route   PUT api/portfolio/:id
// @desc    Update a portfolio item
// @access  Private (Admin only)
router.put('/:id', [auth, adminAuth, upload.single('image')], portfolioController.updatePortfolio);

// @route   DELETE api/portfolio/:id
// @desc    Delete a portfolio item
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth], portfolioController.deletePortfolio);

module.exports = router;