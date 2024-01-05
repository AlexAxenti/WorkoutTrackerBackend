var mongoose = require('mongoose');

var exerciseSchema = new mongoose.Schema({
    exerciseName: String,
    lastWorked: Date,
    logInstances: [{ type: mongoose.Types.ObjectId, ref: "Log" }]
}, { timestamps: true });

module.exports = mongoose.model("Exercise", exerciseSchema)