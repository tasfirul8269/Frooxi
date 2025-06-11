import express from 'express';
import auth from '../middleware/auth.js';
import adminAuth from '../middleware/adminAuth.js';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import TeamMember from '../models/TeamMember.js';

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

// @route   POST api/team
// @desc    Create a team member
// @access  Private (Admin only)
router.post('/', [auth, adminAuth], async (req, res) => {
  try {
    const {
      name,
      position,
      bio,
      image,
      email,
      socialLinks,
      skills
    } = req.body;

    // Create new team member
    const teamMember = new TeamMember({
      name,
      position,
      bio,
      image,
      email,
      socialLinks,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim())
    });

    // Save to database
    await teamMember.save();

    res.json(teamMember);
  } catch (err) {
    console.error('Team member creation error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET api/team
// @desc    Get all team members
// @access  Public
router.get('/', async (req, res) => {
  try {
    const teamMembers = await TeamMember.find().sort({ createdAt: -1 });
    res.json(teamMembers);
  } catch (err) {
    console.error('Get team members error:', err);
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   GET api/team/:id
// @desc    Get team member by ID
// @access  Public
router.get('/:id', async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    
    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    res.json(teamMember);
  } catch (err) {
    console.error('Get team member error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   PUT api/team/:id
// @desc    Update team member
// @access  Private (Admin only)
router.put('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const {
      name,
      position,
      bio,
      image,
      email,
      socialLinks,
      skills
    } = req.body;

    // Build team member object
    const teamMemberFields = {
      name,
      position,
      bio,
      image,
      email,
      socialLinks,
      skills: Array.isArray(skills) ? skills : skills.split(',').map(skill => skill.trim())
    };

    let teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    // Update team member
    teamMember = await TeamMember.findByIdAndUpdate(
      req.params.id,
      { $set: teamMemberFields },
      { new: true }
    );

    res.json(teamMember);
  } catch (err) {
    console.error('Update team member error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

// @route   DELETE api/team/:id
// @desc    Delete team member
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth], async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);

    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    await teamMember.deleteOne();

    res.json({ msg: 'Team member deleted' });
  } catch (err) {
    console.error('Delete team member error:', err);
    if (err.kind === 'ObjectId') {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.status(500).json({ msg: 'Server error', error: err.message });
  }
});

export default router; 