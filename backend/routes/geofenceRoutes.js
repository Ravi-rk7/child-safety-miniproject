const express = require('express');
const router = express.Router();
const geofenceController = require('../controllers/geofenceController');

router.get('/', geofenceController.getGeofences);
router.post('/', geofenceController.createGeofence);
router.put('/:id', geofenceController.updateGeofence);
router.delete('/:id', geofenceController.deleteGeofence);

module.exports = router;
