import express from 'express';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';

const router = express.Router();

// @route   GET api/dashboard/stats
// @desc    Get dashboard statistics
// @access  Private (Admin only)
router.get('/stats', [auth, adminAuth], async (req, res) => {
  try {
    // Dashboard stats logic will go here
    res.json({
      totalUsers: 0,
      totalPortfolios: 0,
      totalSubscriptions: 0,
      totalTeamMembers: 0
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router; 