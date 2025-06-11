const mongoose = require('mongoose');

const SubscriptionSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
  price: {
    type: Number,
    required: true,
  },
  features: {
    type: [String],
    required: true,
  },
  duration: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model('Subscription', SubscriptionSchema);