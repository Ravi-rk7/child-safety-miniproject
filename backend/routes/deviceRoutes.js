const express = require('express');
const router = express.Router();
const deviceController = require('../controllers/deviceController');

router.get('/', deviceController.getDevices);
router.get('/:id', deviceController.getDeviceById);
router.get('/:id/history', deviceController.getDeviceHistory);
router.post('/:id/location', deviceController.updateDeviceLocation);
router.post('/:id/sos', deviceController.triggerSos);

module.exports = router;
