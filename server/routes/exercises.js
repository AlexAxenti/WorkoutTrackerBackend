const express = require('express');
const router = express.Router();

var controller = require('../controllers/exercises');

router.get('/', controller.getExercises);

router.get('/:exerciseId', controller.getExercise);

router.post('/', controller.createExercise);

router.delete('/', controller.deleteExercise);


module.exports = router;
