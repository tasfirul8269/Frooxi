const mongoose = require('mongoose');

const TeamMemberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
  },
  socialLinks: {
    type: Map,
    of: String,
  },
});

module.exports = mongoose.model('TeamMember', TeamMemberSchema);