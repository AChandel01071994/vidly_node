const express = require('express');

const customers = require('../routes/customers');
const movies = require('../routes/movies');
const rentals = require('../routes/rentals');
const users = require('../routes/users');
const auth = require('../routes/auth');
const genres = require('../routes/genres');
const userAuth = require('../middlewares/user-auth');
const adminAuth = require('../middlewares/admin-auth');
const errorHandler = require('../middlewares/error-handler'); 


module.exports = function (app) {
    app.use(express.json());

    app.use('/api/genres', genres);

    app.use('/api/customers', userAuth, customers);

    app.use('/api/movies', userAuth, movies);

    app.use('/api/rentals', [userAuth, adminAuth], rentals);

    app.use('/api/users', users);

    app.use('/api/auth', auth);

    app.use(errorHandler);
}