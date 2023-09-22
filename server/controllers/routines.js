const express = require('express');

var Routine = require('../models/routines');

function getRoutines (req, res) {
    Routine.find({}).then(routines => {
        res.status(404).send(routines)
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

module.exports = {
    getRoutines,
    postRoutines,
    deleteRoutines,
}