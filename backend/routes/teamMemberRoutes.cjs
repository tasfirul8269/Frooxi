const express = require('express');
const router = express.Router();
const teamMemberController = require('../controllers/teamMemberController.cjs');
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

// @route   POST api/team
// @desc    Create a team member
// @access  Private (Admin only)
router.post('/', [auth, adminAuth, upload.single('image')], teamMemberController.createTeamMember);

// @route   GET api/team
// @desc    Get all team members
// @access  Public
router.get('/', teamMemberController.getTeamMembers);

// @route   GET api/team/:id
// @desc    Get team member by ID
// @access  Public
router.get('/:id', teamMemberController.getTeamMemberById);

// @route   PUT api/team/:id
// @desc    Update a team member
// @access  Private (Admin only)
router.put('/:id', [auth, adminAuth, upload.single('image')], teamMemberController.updateTeamMember);

// @route   DELETE api/team/:id
// @desc    Delete a team member
// @access  Private (Admin only)
router.delete('/:id', [auth, adminAuth], teamMemberController.deleteTeamMember);

module.exports = router;