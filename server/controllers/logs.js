const express = require('express')
const mongoose = require('mongoose')

var Log = require('../models/logs');
var Routine = require('../models/routines')
var Exercise = require('../models/exercises')

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

    const today = new Date();
    const dd = String(today.getDate()).padStart(2, '0');
    const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    const yyyy = today.getFullYear();
    const hr = today.getHours();
    const mt = today.getMinutes();
    const date = yyyy + "-" + mm + "-" + dd + " " + hr + ":" + mt;

    logDate = date

    // Create base log without a routine yet
    let log = new Log({
        logName: logName,
        logDate: logDate,
    })

    // Check if routine was passed, if so then add exercises and update their log instances, else save log and send response
    if (logRoutine != 'None') {
        const routine = await Routine.findOne({ 'routineName': logRoutine })

        if (!routine) {
            return res.status(404).send("Unable to find routine")
        }

        const session = await mongoose.startSession()
        session.startTransaction()
        await log.save({session})

        console.log("First saved log:", log)
        logId = log._id

        try {
            // For each exercise, update the exercise's log instances and add the exercise to the log's exercises
            for (const exercise of routine.routineExercises) {
                
                const exerciseObject = await Exercise.findOne({ 'exerciseName': exercise })

                if (!exerciseObject) {
                    throw new Error("The exercise " + exercise + " cannot be found.")
                }

                exerciseObject.logInstances.push(logId)
                await exerciseObject.save({session})

                logExercises.push({ exerciseName: exercise, sets: [] }) 
            }

            // After each exercise has been iterated and updated, complete the final edits to the log
            log.logRoutine = logRoutine
            log.logExercises = logExercises

            await log.save({session})

            console.log("Finished saved log:", log)

            await session.commitTransaction()
            res.status(200).send(log._id)
        } catch (error) {
            console.log("Transaction aborted:", error)
            await session.abortTransaction() 
            return res.status(404).send("Error creating log")
        } finally {
            await session.endSession()
        }
    } else {
        console.log("none!")
        log.save()
        res.status(200).send(log._id)
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

async function updateLogs (req, res) {
    let reqBody = req.body
    let logId = reqBody._id

    const log = await Log.findOne({ _id: logId })
    
    if (log) { 
        log.logName = reqBody.logName
        log.logRoutine = reqBody.logRoutine

        updatedExercises = checkForNewLogExercises(log.logExercises, reqBody.logExercises)
        if (updatedExercises == false) {
            console.log("Same")
        } else {
            console.log("Different")
            console.log("removedNames:", updatedExercises.removedNames)
            console.log("newNames:", updatedExercises.newNames)

            const session = await mongoose.startSession()
            session.startTransaction()

            try {
                for (const exercise of updatedExercises.removedNames) {
                    const exerciseObject = await Exercise.findOne({ exerciseName: exercise })

                    if (!exerciseObject) {
                        throw new Error("The exercise " + exercise + " cannot be found.")
                    }

                    console.log("ID:", logId)
                    console.log(exerciseObject.logInstances)
                    console.log(exerciseObject.logInstances[0] == logId)
                    console.log(exerciseObject.logInstances[1] == logId)

                    exerciseObject.logInstances = exerciseObject.logInstances.filter(id => id != logId)

                    console.log(exerciseObject.logInstances)
                    await exerciseObject.save({session})
                }

                for (const exercise of updatedExercises.newNames) {
                    const exerciseObject = await Exercise.findOne({ exerciseName: exercise })

                    if (!exerciseObject) {
                        throw new Error("The exercise " + exercise + " cannot be found.")
                    }

                    exerciseObject.logInstances.push(logId)
                    await exerciseObject.save({session})
                }

                log.logExercises = reqBody.logExercises
                await log.save({session})
                await session.commitTransaction()

                res.status(200).send(log)
            } catch (error) {
                console.log("Transaction aborted:", error)
                await session.abortTransaction()
                return res.status(404).send("Error updating log")
            } finally {
                await session.endSession()
            }
        }
    } else {
        console.log(err)
        res.status(404).send("Unable to update log")
    }
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

// Helper functions
function checkForNewLogExercises(originalExercises, updatedExercises) {
    originalNames = []
    updatedNames = []

    for (const exercise of originalExercises) { 
        originalNames.push(exercise.exerciseName)
    }

    for (const exercise of updatedExercises) {
        updatedNames.push(exercise.exerciseName)
    }

    const removedNames = originalNames.filter(name => !updatedNames.includes(name))
    const newNames = updatedNames.filter(name => !originalNames.includes(name))

    if (originalNames.length == updatedNames.length && removedNames.length == 0 && newNames.length == 0) {
        return false
    } else {
        return {removedNames: removedNames, newNames: newNames}
    }
}

module.exports = {
    getLogs,
    getLog,
    postLogs,
    deleteLogs,
    updateLogs,
    updateLogExercise
}