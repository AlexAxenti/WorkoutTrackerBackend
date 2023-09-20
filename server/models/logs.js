var mongoose = require('mongoose');

var logSchema = new mongoose.Schema({
    logName: String,
    logDate: Date,
    routine: String,
    exercises: {
        sets: [{
            setNumber: Number,
            reps: Number,
            weight: Number,
        }]
    },
}, { timestamps: true });

module.exports = mongoose.model("Log", logSchema)