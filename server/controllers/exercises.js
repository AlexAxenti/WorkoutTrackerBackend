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
    exerciseId = req.params.exerciseId

    Exercise.findOne({ _id: exerciseId }).then(exercise => {
        res.status(200).send(exercise)
    }).catch(err => {
        console.log(err)
        res.status(404)
    });
};

async function createExercise(req, res) {
    reqBody = req.body;
    exerciseName = reqBody.exerciseName;
    lastWorked = undefined

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
    reqBody = req.body
    exerciseName = reqBody.exerciseName

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