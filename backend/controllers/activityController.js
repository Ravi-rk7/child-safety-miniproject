const { fbGet } = require('../models/firebaseModel');

exports.getActivitiesByDeviceId = async (req, res) => {
  try {
    const activities = await fbGet(`activities/${req.params.deviceId}`);
    if (!activities) return res.json([]);
    const arr = Object.values(activities).sort((a, b) => b.timestamp - a.timestamp);
    res.json(arr);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
