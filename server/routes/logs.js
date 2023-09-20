const express = require('express');
const router = express.Router();

var controller = require('../controllers/logs');

router.get('/', controller.getLogs);

router.post('/', controller.postLogs);

module.exports = router;
