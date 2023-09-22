var mongoose = require('mongoose');

var routineSchema = new mongoose.Schema({
    routineName: String,
    routineExercises: [String],
}, { timestamps: true });

module.exports = mongoose.model("Routine", routineSchema)