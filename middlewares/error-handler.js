const winston = require('winston');

module.exports = (err, req, res, next) => {
    // log errors here
    winston.error(err.message);
    res.status(500).send('Something failed.');
}