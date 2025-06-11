import express from 'express';
import { auth, adminAuth } from '../middleware/auth.js';
import TeamMember from '../models/TeamMember.js';

const router = express.Router();

// @route   GET /api/team
// @desc    Get all team members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    res.json(teamMembers);
  } catch (error) {
    console.error('Error fetching team members:', error);
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   GET /api/team/:id
// @desc    Get team member by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (error) {
    console.error('Error fetching team member:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   POST /api/team
// @desc    Create a team member
// @access  Private/Admin
router.post('/', [auth, adminAuth], async (req, res) => {
  try {
    const { name, position, bio, image, email, socialLinks, skills } = req.body;

    // Validate required fields
    if (!name || !position || !bio || !image || !email) {
      return res.status(400).json({ msg: 'Please fill in all required fields' });
    }

    // Create new team member
    const teamMember = new TeamMember({
      name,
      position,
      bio,
      image,
      email,
      socialLinks: socialLinks || {},
      skills: skills || [],
    });

    await teamMember.save();
    res.status(201).json(teamMember);
  } catch (error) {
    console.error('Error creating team member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: error.message });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   PUT /api/team/:id
// @desc    Update a team member
// @access  Private/Admin
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const { name, position, bio, image, email, socialLinks, skills } = req.body;

    // Validate required fields
    if (!name || !position || !bio || !image || !email) {
      return res.status(400).json({ msg: 'Please fill in all required fields' });
    }

    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    // Update team member
    teamMember.name = name;
    teamMember.position = position;
    teamMember.bio = bio;
    teamMember.image = image;
    teamMember.email = email;
    teamMember.socialLinks = socialLinks || {};
    teamMember.skills = skills || [];

    await teamMember.save();
    res.json(teamMember);
  } catch (error) {
    console.error('Error updating team member:', error);
    if (error.name === 'ValidationError') {
      return res.status(400).json({ msg: error.message });
    }
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

// @route   DELETE /api/team/:id
// @desc    Delete a team member
// @access  Private/Admin
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    await teamMember.deleteOne();
    res.json({ msg: 'Team member removed' });
  } catch (error) {
    console.error('Error deleting team member:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.status(500).json({ msg: 'Server error' });
  }
});

export default router; 