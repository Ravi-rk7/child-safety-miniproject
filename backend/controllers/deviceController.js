const { fbGet, fbUpdate, fbPush } = require('../models/firebaseModel');

exports.getDevices = async (req, res) => {
  try {
    const devices = await fbGet('devices');
    res.json(devices || {});
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeviceById = async (req, res) => {
  try {
    const device = await fbGet(`devices/${req.params.id}`);
    if (!device) return res.status(404).json({ error: 'Device not found' });
    res.json(device);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getDeviceHistory = async (req, res) => {
  try {
    const history = await fbGet(`locationHistory/${req.params.id}`);
    if (!history) return res.json([]);
    const historyArray = Object.values(history).sort((a, b) => a.timestamp - b.timestamp);
    res.json(historyArray);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateDeviceLocation = async (req, res) => {
  try {
    const { latitude, longitude, sosStatus } = req.body;
    const timestamp = Date.now();
    const locationData = { latitude, longitude, timestamp, sosStatus: sosStatus || false };

    await fbUpdate(`devices/${req.params.id}`, {
      currentLocation: locationData,
      lastUpdated: timestamp,
    });

    await fbPush(`locationHistory/${req.params.id}`, locationData);

    if (sosStatus) {
      await fbPush('alerts', {
        deviceId: req.params.id,
        type: 'sos',
        message: '🚨 SOS Alert! Emergency button pressed!',
        latitude,
        longitude,
        timestamp,
        read: false,
      });
    }

    res.json({ success: true, location: locationData });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.triggerSos = async (req, res) => {
  try {
    const device = await fbGet(`devices/${req.params.id}`);
    if (!device) return res.status(404).json({ error: 'Device not found' });

    const loc = device.currentLocation || {};
    const timestamp = Date.now();

    await fbPush('alerts', {
      deviceId: req.params.id,
      type: 'sos',
      message: `🚨 SOS from ${device.childName}! Emergency button pressed!`,
      latitude: loc.latitude,
      longitude: loc.longitude,
      timestamp,
      read: false,
    });

    await fbUpdate(`devices/${req.params.id}`, { sosActive: true });

    res.json({ success: true, message: 'SOS alert created' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
