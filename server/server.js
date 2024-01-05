const express = require('express')
const mongoose = require('mongoose')
const bodyparser = require('body-parser')
const cors = require('cors')
require('dotenv').config();
const app = express()
const port = 7000

var logger = require('./middleware/logger');
var logsRouter = require('./routes/logs');
var routinesRouter = require('./routes/routines');
var exercisesRouter = require('./routes/exercises');


mongoose.connect(process.env.MONGO_DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(logger);
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.use(cors());
app.use('/logs', logsRouter);
app.use('/routines', routinesRouter);
app.use('/exercises', exercisesRouter);


app.listen(process.env.PORT || 7000, () => {
    console.log(`Example app listening on port ${port}`)
})