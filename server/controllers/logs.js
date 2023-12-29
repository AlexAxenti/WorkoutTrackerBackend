const express = require('express');

var Log = require('../models/logs');
var Routine = require('../models/routines')

function getLogs (req, res) {
    Log.find({}).select('-logExercises').sort({ createdAt: 'desc' }).then(logs => {
        res.status(200).send(logs)
    }).catch(err => {
        console.log(err)
        res.status(404)
    });
};

function getLog(req, res) {
    logId = req.params.logId

    Log.findOne({ _id: logId }).then(log => {
        res.status(200).send(log)
    }).catch(err => {
        console.log(err)
        res.status(404)
    });
};

async function postLogs (req, res) {
    reqBody = req.body;
    logName = reqBody.logName;
    logRoutine = reqBody.logRoutine;
    logExercises = []

    if (logRoutine != 'None') {
        // Routine.findOne({ 'routineName': logRoutine }).then(routine => {
        //     logExercises = routine.routineExercises
        // })
        // .catch(err => {
        //     console.log(err)
        //     res.status(404).send("Unable to find routine")
        // })
        console.log("searching")
        const routine = await Routine.findOne({ 'routineName': logRoutine })
        console.log("found", routine)
        if(!routine) {
            return res.status(404).send("Unable to find routine")
        }

        for (const exercise of routine.routineExercises) {
            logExercises.push({exerciseName: exercise, sets: []})
        }
        //logExercises = routine.routineExercises
    }

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const hr = today.getHours();
    const mt = today.getMinutes();
    const date = yyyy + "-" + mm + "-" + dd + " " + hr + ":" + mt;

    logDate = date
    console.log(logExercises)
    let log = new Log({
        logName: logName,
        logDate: logDate,
        logRoutine: logRoutine,
        logExercises: logExercises
    })

    log.save()
    console.log(log)
    res.status(200).send(log._id)
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
        res.status(200).send(log)
    })
    .catch(err => {
        console.log(err)
        res.status(404).send("Unable to update log")
    })
}


function updateLogExercise(req, res) {
    let reqBody = req.body

    let logId = reqBody.logId
    let exerciseId = reqBody.exerciseId

    Log.findOne({ _id: logId }).then(log => {
        for(i = 0; i < log.logExercises.length; i++) {
            if(log.logExercises[i]._id == exerciseId) {
                log.logExercises[i].sets = reqBody.sets
                log.logExercises[i].exerciseName = reqBody.exerciseName
            }
        }

        log.save()
        res.status(200).send(log)
    })
    .catch(err => {
        console.log(err)
        res.status(404).send("Unable to update log")
    })
}

module.exports = {
    getLogs,
    getLog,
    postLogs,
    deleteLogs,
    updateLogs,
    updateLogExercise
}