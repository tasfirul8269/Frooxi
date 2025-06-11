const TeamMember = require('../models/TeamMember.cjs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.createTeamMember = async (req, res) => {
  const { name, role, bio, socialLinks } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  try {
    let uploadedImageUrl = '';
    if (imageUrl) {
      const result = await cloudinary.uploader.upload(imageUrl);
      uploadedImageUrl = result.secure_url;
    }

    const newTeamMember = new TeamMember({
      name,
      role,
      imageUrl: uploadedImageUrl,
      bio,
      socialLinks: socialLinks || {},
    });

    const teamMember = await newTeamMember.save();
    res.json(teamMember);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.find();
    res.json(teamMembers);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }
    res.json(teamMember);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateTeamMember = async (req, res) => {
  const { name, role, bio, socialLinks } = req.body;
  const imageUrl = req.file ? req.file.path : null;

  try {
    let teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    if (imageUrl) {
      if (teamMember.imageUrl) {
        const publicId = teamMember.imageUrl.split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId);
      }
      const result = await cloudinary.uploader.upload(imageUrl);
      teamMember.imageUrl = result.secure_url;
    }

    teamMember.name = name || teamMember.name;
    teamMember.role = role || teamMember.role;
    teamMember.bio = bio || teamMember.bio;
    teamMember.socialLinks = socialLinks || teamMember.socialLinks;

    await teamMember.save();
    res.json(teamMember);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findById(req.params.id);
    if (!teamMember) {
      return res.status(404).json({ msg: 'Team member not found' });
    }

    if (teamMember.imageUrl) {
      const publicId = teamMember.imageUrl.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId);
    }

    await TeamMember.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Team member removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};