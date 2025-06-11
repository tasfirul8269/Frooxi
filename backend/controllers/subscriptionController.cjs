const Subscription = require('../models/Subscription.cjs');

exports.createSubscription = async (req, res) => {
  const { name, price, features, duration } = req.body;

  try {
    const newSubscription = new Subscription({
      name,
      price,
      features,
      duration,
    });

    const subscription = await newSubscription.save();
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getSubscriptions = async (req, res) => {
  try {
    const subscriptions = await Subscription.find();
    res.json(subscriptions);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.getSubscriptionById = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription not found' });
    }
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.updateSubscription = async (req, res) => {
  const { name, price, features, duration } = req.body;

  try {
    let subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription not found' });
    }

    subscription.name = name || subscription.name;
    subscription.price = price || subscription.price;
    subscription.features = features || subscription.features;
    subscription.duration = duration || subscription.duration;

    await subscription.save();
    res.json(subscription);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

exports.deleteSubscription = async (req, res) => {
  try {
    const subscription = await Subscription.findById(req.params.id);
    if (!subscription) {
      return res.status(404).json({ msg: 'Subscription not found' });
    }

    await Subscription.deleteOne({ _id: req.params.id });
    res.json({ msg: 'Subscription removed' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};