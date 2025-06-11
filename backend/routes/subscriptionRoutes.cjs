const express = require('express');
const router = express.Router();
const subscriptionController = require('../controllers/subscriptionController.cjs');
const auth = require('../middleware/auth.cjs');
const adminAuth = require('../middleware/adminAuth.cjs');

// @route   POST api/subscriptions
// @desc    Create a subscription plan
// @access  Private (Admin only)
router.post('/', [auth, adminAuth], subscriptionController.createSubscription);

// @route   GET api/subscriptions
// @desc    Get all subscription plans
// @access  Public
router.get('/', subscriptionController.getSubscriptions);

// @route   GET api/subscriptions/:id
// @desc    Get subscription plan by ID
// @access  Public
router.get('/:id', subscriptionController.getSubscriptionById);

// @route   PUT api/subscriptions/:id
// @desc    Update a subscription plan
// @access  Private (Admin only)
router.put('/:id', [auth, adminAuth], subscriptionController.updateSubscription);

// @route   DELETE api/subscriptions/:id
// @desc    Delete a subscription plan
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth], subscriptionController.deleteSubscription);

module.exports = router;