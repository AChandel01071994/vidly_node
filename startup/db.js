const mongoose = require('mongoose');
const winston = require('winston');
const config = require('config');


module.exports = function () {
    const dbConnection = config.get('dbConnection');
    mongoose.connect(dbConnection)
        .then(() => winston.info(`MongoDB connected to ${dbConnection}...`));
}