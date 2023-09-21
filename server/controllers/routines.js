const express = require('express');

var Routine = require('../models/routines');

function getRoutines (req, res) {
    res.send('Get Routines')
};

function postRoutines (req, res) {
    res.send('Post Routines')
};

function updateRoutines (req, res) {
    let reqBody = req.body
    let routineId = reqBody._id

    Routine.findOne({ _id: routineId }).then(routine => {
        routine.routineName = reqBody.routineName
        routine.exerciseNames = reqBody.exerciseNames

        routine.save()
    });
};

module.exports = {
    getRoutines,
    postRoutines,
}