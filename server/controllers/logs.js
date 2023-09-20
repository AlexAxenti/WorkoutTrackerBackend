const express = require('express');

var Log = require('../models/logs');

function getLogs (req, res) {
    res.send('Get Logs')
};

function postLogs (req, res) {
    res.send('Post Logs')
};

module.exports = {
    getLogs,
    postLogs,
}