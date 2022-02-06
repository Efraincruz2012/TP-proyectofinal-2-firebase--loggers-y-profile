//Import the mongoose module
const mongooseLib = require('mongoose');

//connection
var mongoDB = 'mongodb://localhost/test';
mongooseLib.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});


const db = mongooseLib.connection;

//mensage de error
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = { db, mongooseLib };