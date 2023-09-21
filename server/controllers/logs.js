const express = require('express');

var Log = require('../models/logs');

function getLogs (req, res) {
    res.send('Get Logs')
};

function postLogs (req, res) {
    res.send('Post Logs')
};

function updateLogs (req, res) {
    let reqBody = req.body
    let logId = reqBody._id

    Log.findOne({ _id: logId }).then(log => {
        log.logName = reqBody.logName
        log.logRoutine = reqBody.logRoutine
        log.logExercises = reqBody.logExercises

        log.save()
    })
}

module.exports = {
    getLogs,
    postLogs,
}