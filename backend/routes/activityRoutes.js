const express = require('express');
const router = express.Router();
const activityController = require('../controllers/activityController');

router.get('/:deviceId', activityController.getActivitiesByDeviceId);

module.exports = router;
