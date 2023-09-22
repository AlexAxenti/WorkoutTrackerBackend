const express = require('express');

var Log = require('../models/logs');
var Routine = require('../models/routines');

function getLogs (req, res) {
    Log.find({}).then(logs => {
        res.status(404).send(logs)
    }).catch(err => {
        console.log(err)
        res.status(404)
    });
};

function postLogs (req, res) {
    reqBody = req.body;
    logName = reqBody.logName;
    logRoutine = reqBody.logRoutine;
    logExercises = []

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const hr = today.getHours();
    const mt = today.getMinutes();
    const date = yyyy + "-" + mm + "-" + dd + " " + hr + ":" + mt;

    logDate = date

    let log = new Log({
        logName,
        logDate,
        logRoutine,
        logExercises
    })

    if(logRoutine) {
        Routine.findOne({ routineName: logRoutine }).then(routine => {
            routineExercises = routine.routineExercises
            for (let i = 0; i < routineExercises.length; i++) {
                console.log(routineExercises[i])
                exercise = {
                    exerciseName: routineExercises[i],
                    sets: []
                }
                logExercises.push(exercise)
            }
            log.logExercises = logExercises;
            log.save();

            res.status(200).send(log)
        }).catch(err => {
            console.log(err)
            res.status(500).send("Error Creating Logs")
        });
    } else {
        log.save();

        res.status(200).send(log)
    }
};

function deleteLogs(req, res) {
    reqBody = req.body;
    logId = req.body._id;

    Log.deleteOne({ _id: logId }).catch(err => {
        console.log(err)
        res.status(404).send("Error")
    })

    res.status(200).send('Log Deleted')
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
    deleteLogs,
}