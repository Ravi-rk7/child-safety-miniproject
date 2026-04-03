const express = require('express');
const router = express.Router();
const alertController = require('../controllers/alertController');

router.get('/', alertController.getAlerts);
router.put('/:id/read', alertController.markAlertRead);

module.exports = router;
