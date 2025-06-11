import express from 'express';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import Subscription from '../models/Subscription.js';

const router = express.Router();

// @route   POST api/subscriptions
// @desc    Create a subscription plan
// @access  Private (Admin only)
router.post('/', [auth, adminAuth], async (req, res) => {
  try {
    console.log('Received subscription creation request:', req.body);
    
    const {
      name,
      description,
      price,
      duration,
      features,
      isActive
    } = req.body;

    // Validate required fields
    if (!name || !description || price === undefined || duration === undefined) {
      return res.status(400).json({
        msg: 'Missing required fields',
        required: ['name', 'description', 'price', 'duration']
      });
    }

    // Validate price and duration
    if (price < 0 || duration < 1) {
      return res.status(400).json({
        msg: 'Invalid price or duration',
        details: {
          price: 'Must be greater than or equal to 0',
          duration: 'Must be greater than 0'
        }
      });
    }

    console.log('Extracted data:', {
      name,
      description,
      price,
      duration,
      features,
      isActive
    });

    // Create new subscription
    const subscription = new Subscription({
      name,
      description,
      price: Number(price),
      duration: Number(duration),
      features: Array.isArray(features) ? features : features.split(',').map(feature => feature.trim()),
      isActive: Boolean(isActive)
    });

    console.log('Created subscription object:', subscription);

    // Save to database
    const savedSubscription = await subscription.save();
    console.log('Saved subscription:', savedSubscription);

    res.status(201).json(savedSubscription);
  } catch (err) {
    console.error('Subscription creation error:', err);
    console.error('Error details:', {
      message: err.message,
      stack: err.stack,
      name: err.name
    });

    // Handle validation errors
    if (err.name === 'ValidationError') {
      return res.status(400).json({
        msg: 'Validation error',
        errors: Object.values(err.errors).map(error => error.message)
      });
    }

    // Handle duplicate key errors
    if (err.code === 11000) {
      return res.status(400).json({
        msg: 'Duplicate subscription name',
        error: 'A subscription with this name already exists'
      });
    }

    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET api/subscriptions
// @desc    Get all subscription plans
// @access  Public
router.get('/', async (req, res) => {
  try {
    const subscriptions = await Subscription.find().sort({ price: 1 });
    res.json(subscriptions);
  } catch (err) {
    console.error('Get subscriptions error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET api/subscriptions/:id
// @desc    Get subscription plan by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }

    res.json(subscription);
  } catch (err) {
    console.error('Get subscription error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   PUT api/subscriptions/:id
// @desc    Update subscription plan
// @access  Private (Admin only)
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      duration,
      features,
      isActive
    } = req.body;

    // Build subscription object
    const subscriptionFields = {
      name,
      description,
      price,
      duration,
      features: Array.isArray(features) ? features : features.split(',').map(feature => feature.trim()),
      isActive
    };

    let subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }

    // Update subscription
    subscription = await Subscription.findByIdAndUpdate(
      req.params.id,
      { $set: subscriptionFields },
      { new: true }
    );

    res.json(subscription);
  } catch (err) {
    console.error('Update subscription error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   DELETE api/subscriptions/:id
// @desc    Delete subscription plan
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);

    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }

    await subscription.deleteOne();

    res.json({ msg: 'Subscription plan deleted' });
  } catch (err) {
    console.error('Delete subscription error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Subscription plan not found' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

export default router; 