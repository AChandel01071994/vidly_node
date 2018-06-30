const winston = require('winston');
require('winston-mongodb');
require('express-async-errors');


module.exports = function () {
    winston.configure({
        transports: [
            new winston.transports.File({ filename: 'somefile.log' }),
            new winston.transports.MongoDB({ db: 'mongodb://localhost/vidly' }),
            new winston.transports.Console({ colorize: true, prettyPrint: true })

        ]
    });

    // process.on('uncaughtException', (ex) => {
    //     console.log(ex.message);
    //     winston.error(ex.message, ex);
    //     process.exit(1);
    // });

    winston.exceptions.handle(
        new winston.transports.File({ filename: 'exceptions.log' }),
        new winston.transports.Console({ colorize: true, prettyPrint: true })
    );

    process.on('unhandledRejection', (ex) => {
        throw ex;
    })

    // throw new Error('my customs error');
    // const p = Promise.reject(new Error('promise rejection error'));

}