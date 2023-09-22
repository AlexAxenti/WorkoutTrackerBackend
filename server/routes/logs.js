const express = require('express');
const router = express.Router();

var controller = require('../controllers/logs');

router.get('/', controller.getLogs);

router.post('/', controller.postLogs);

router.put('/', controller.updateLogs);

router.delete('/', controller.deleteLogs);

module.exports = router;
