const { fbGet, fbUpdate } = require('../models/firebaseModel');

exports.getAlerts = async (req, res) => {
  try {
    const alerts = await fbGet('alerts');
    if (!alerts) return res.json([]);
    const alertsArray = Object.entries(alerts)
      .map(([id, data]) => ({ id, ...data }))
      .sort((a, b) => b.timestamp - a.timestamp)
      .slice(0, 20);
    res.json(alertsArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.markAlertRead = async (req, res) => {
  try {
    await fbUpdate(`alerts/${req.params.id}`, { read: true });
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
