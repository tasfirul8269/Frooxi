// @ts-nocheck
import mongoose from 'mongoose';
import User from '../models/User.js';
import Portfolio from '../models/Portfolio.js';
import Subscription from '../models/Subscription.js';
import Testimonial from '../models/Testimonial.js';
import TeamMember from '../models/TeamMember.js';

// Helper function to safely get count from a model
const getSafeCount = async (model, query = {}) => {
  try {
    if (!model || !mongoose.model(model.modelName)) {
      console.warn(`Model ${model?.modelName} not found`);
      return 0;
    }
    return await model.countDocuments(query);
  } catch (error) {
    console.error(`Error counting documents for ${model?.modelName}:`, error);
    return 0;
  }
};

export const getDashboardStats = async (req, res) => {
  try {
    // Check if models are available
    const models = { User, Portfolio, Subscription, Testimonial, TeamMember };
    const modelsAvailable = Object.entries(models).every(([name, model]) => {
      const isAvailable = model && mongoose.model(model.modelName);
      if (!isAvailable) {
        console.error(`Model ${name} is not available`);
      }
      return isAvailable;
    });

    if (!modelsAvailable) {
      return res.status(500).json({
        success: false,
        message: 'Some database models are not available',
        error: 'Database models not properly initialized'
      });
    }

    // Get counts for each model
    const [
      usersCount,
      portfolioItemsCount,
      activeSubscriptionsCount,
      testimonialsCount,
      teamMembersCount
    ] = await Promise.all([
      getSafeCount(User),
      getSafeCount(Portfolio),
      getSafeCount(Subscription, { status: 'active' }),
      getSafeCount(Testimonial),
      getSafeCount(TeamMember)
    ]);

    // Get recent activities (you can customize this based on your needs)
    let recentActivities = [];
    try {
      recentActivities = await User.find()
        .sort({ createdAt: -1 })
        .limit(5)
        .select('name email role createdAt');
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      // Continue with empty recent activities if there's an error
    }

    res.status(200).json({
      success: true,
      stats: {
        users: usersCount,
        portfolioItems: portfolioItemsCount,
        activeSubscriptions: activeSubscriptionsCount,
        testimonials: testimonialsCount,
        teamMembers: teamMembersCount
      },
      recentActivities
    });
  } catch (error) {
    console.error('Error in getDashboardStats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching dashboard statistics',
      error: process.env.NODE_ENV === 'development' ? {
        message: error.message,
        stack: error.stack,
        name: error.name
      } : undefined
    });
  }
};
