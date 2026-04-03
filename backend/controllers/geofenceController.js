const { fbGet, fbPush, fbUpdate, fbDelete } = require('../models/firebaseModel');

exports.getGeofences = async (req, res) => {
  try {
    const geofences = await fbGet('geofences');
    res.json(geofences || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.createGeofence = async (req, res) => {
  try {
    const result = await fbPush('geofences', req.body);
    res.json({ id: result.name, ...req.body });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateGeofence = async (req, res) => {
  try {
    await fbUpdate(`geofences/${req.params.id}`, req.body);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteGeofence = async (req, res) => {
  try {
    await fbDelete(`geofences/${req.params.id}`);
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
