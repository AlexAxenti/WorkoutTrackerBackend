const express = require('express');

var Log = require('../models/logs');
var Exercise = require('../models/exercises')

function getExercises(req, res) {
    Exercise.find({}).select('-logInstances').sort({ exerciseName:1 }).then(exercises => {
        res.status(200).send(exercises)
    }).catch(err => {
        console.log(err)
        res.status(404)
    });
};

function getExercise(req, res) {
    let exerciseId = req.params.exerciseId

    Exercise.findOne({ _id: exerciseId }).then(exercise => {
        let logInstances = exercise.logInstances
        let exerciseLogs = []

        Log.find({ _id: { $in: logInstances } }).sort({ logDate: 'asc' }).then(logs => {
            for (const log of logs) {
                let logObject = {}
                logObject.logId = log._id
                logObject.logName = log.logName
                logObject.logDate = log.logDate
                logObject.logRoutine = log.logRoutine

                let setsArray = (log.logExercises.filter(logExercise => logExercise.exerciseName == exercise.exerciseName))[0].sets
                logObject.sets = setsArray

                exerciseLogs.push(logObject)
            }

            let exerciseResponse = {}
            exerciseResponse._id = exercise._id
            exerciseResponse.exerciseName = exercise.exerciseName
            exerciseResponse.lastWorked = exercise.lastWorked
            exerciseResponse.exerciseHistory = exerciseLogs

            res.status(200).send(exerciseResponse)
        })
    }).catch(err => {
        console.log(err)
        res.status(404)
    });
};

async function createExercise(req, res) {
    let reqBody = req.body;
    let exerciseName = reqBody.exerciseName;
    let lastWorked = undefined

    const existingExercise = await Exercise.findOne({ exerciseName: exerciseName })

    if (existingExercise) {
        return res.status(400).send("Exercise already exists");
    }

    if(reqBody.lastWorked) {
        lastWorked = reqBody.lastWorked
    } 

    const exercise = new Exercise({
        exerciseName: exerciseName,
        lastWorked: lastWorked,
        logInstances: [],
    })

    exercise.save()
    res.status(200).send(exercise);
};

function deleteExercise(req, res) {
    let reqBody = req.body
    let exerciseName = reqBody.exerciseName

    Exercise.deleteOne({ exerciseName: exerciseName }).then(result => {
        if (result.deletedCount == 1) {
            res.status(200).send("Deleted exercise")
        } else {
            res.status(400).send("Exercise not found")
        }
    })
    .catch(err => {
        console.log(err)
        res.status(404)
    })
}

module.exports = {
    getExercises,
    getExercise,
    createExercise,
    deleteExercise,
}