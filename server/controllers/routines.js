const express = require('express');

var Routine = require('../models/routines');

function getRoutines (req, res) {
    res.send('Get Routines')
};

function postRoutines (req, res) {
    res.send('Post Routines')
};

module.exports = {
    getRoutines,
    postRoutines,
}