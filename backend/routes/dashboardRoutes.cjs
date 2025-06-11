const express = require('express');
const router = express.Router();
const Portfolio = require('../models/Portfolio.cjs');
const Subscription = require('../models/Subscription.cjs');
const TeamMember = require('../models/TeamMember.cjs');
const User = require('../models/User.cjs');

// Get dashboard statistics
router.get('/stats', async (req, res) => {
  try {
    const [portfolios, subscriptions, teamMembers, users] = await Promise.all([
      Portfolio.countDocuments(),
      Subscription.countDocuments({ status: 'active' }),
      TeamMember.countDocuments(),
      User.countDocuments()
    ]);

    res.json({
      totalPortfolios: portfolios,
      activeSubscriptions: subscriptions,
      teamMembers: teamMembers,
      totalUsers: users
    });
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
