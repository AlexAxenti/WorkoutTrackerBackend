const express = require('express');
const router = express.Router();

var controller = require('../controllers/routines');

router.get('/', controller.getRoutines);

router.post('/', controller.postRoutines);

router.delete('/', controller.deleteRoutines);

module.exports = router;
