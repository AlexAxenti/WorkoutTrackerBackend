const express = require('express')
const mongoose = require('mongoose');
const app = express()
const port = 7000

var logger = require('./middleware/logger');
var logsRouter = require('./routes/logs');
var routinesRouter = require('./routes/routines');

// console.log(process.env.MONGO_DB_CONNECTION);
// mongoose.connect(process.env.MONGO_DB_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true });

app.use(logger);

//app.use(cors());
app.use('/logs', logsRouter);
app.use('/routines', routinesRouter);

// app.get('*', (req, res) => {
//     res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'))
// });

app.listen(process.env.PORT || 7000, () => {
    console.log(`Example app listening on port ${port}`)
})