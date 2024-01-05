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

function createExercise(req, res) {
    reqBody = req.body;
    exerciseName = reqBody.exerciseName;
    lastWorked = undefined

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

module.exports = {
    getExercises,
    getExercise,
    createExercise,
}