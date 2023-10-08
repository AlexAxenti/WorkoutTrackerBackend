const express = require('express');

var Routine = require('../models/routines');

function getRoutines (req, res) {
    Routine.find({}).sort({ routineName: 1 }).then(routines => {
        res.status(200).send(routines)
    }).catch(err => {
        console.log(err)
        res.status(404)
    });
};

function postRoutines (req, res) {
    reqBody = req.body;
    routineName = reqBody.routineName;
    routineExercises = reqBody.routineExercises;

    const routine = new Routine({
        routineName: routineName,
        routineExercises: routineExercises
    })

    routine.save()
    res.status(200).send(routine);
};

function deleteRoutines(req, res) {
    reqBody = req.body;
    routineId = req.body._id;

    Routine.deleteOne({ _id: routineId }).catch(err => {
        console.log(err)
        res.status(404).send("Error")
    })

    res.status(200).send('Routine Deleted')
};

function updateRoutines (req, res) {
    let reqBody = req.body
    let routineId = reqBody._id

    Routine.findOne({ _id: routineId }).then(routine => {
        routine.routineName = reqBody.routineName
        routine.routineExercises = reqBody.routineExercises

        routine.save()
        res.status(200).send(routine)
    })
    .catch(err => {
        console.log(err)
        res.status(404).send("Unable to update routine")
    })
};

module.exports = {
    getRoutines,
    postRoutines,
    deleteRoutines,
    updateRoutines,
}