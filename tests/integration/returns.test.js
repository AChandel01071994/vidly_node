const { Rental } = require('../../models/rentals');
const { User } = require('../../models/user');
const { Movie } = require('../../models/movies');
const mongoose = require('mongoose');
const request = require('supertest');
const moment = require('moment');

let server;

describe('/api/returns', () => {
    let movieId;
    let customerId;
    let rental;
    let token;
    let userId;
    let movie;

    const exec = () => {
        return request(server)
            .post('/api/returns')
            .set('x-auth-token', token)
            .send({
                movieId,
                customerId
            });
    }

    beforeEach(async () => {
        server = require('../../index');

        userId = mongoose.Types.ObjectId();
        movieId = mongoose.Types.ObjectId();
        customerId = mongoose.Types.ObjectId();

        token = new User({
            _id: userId,
            isAdmin: true
        }).getAuthToken();

        movie = new Movie({
            _id: movieId,
            numberInStock: 10,
            genre: {
                name: '12345'
            },
            title: '12345',
            dailyRentalRate: 10
        });

        await movie.save();

        rental = new Rental({
            movie: {
                _id: movieId,
                title: '12345',
                dailyRentalRate: 10
            },
            customer: {
                _id: customerId,
                name: '12345',
                phone: '123456789'
            }
        });

        await rental.save();
    });

    afterEach(async () => {
        await server.close();
        await Rental.remove({});
        await Movie.remove({});
    });

    it('should return 401 if client is not logged in', async () => {
        token = '';
        const res = await exec();

        expect(res.status).toBe(401);
    });

    it('should return 400 if customerId is not provided', async () => {
        customerId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 400 if movieId is not provided', async () => {
        movieId = '';
        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 404 if rental for the given combination does not exists', async () => {
        await Rental.remove({});

        const res = await exec();

        expect(res.status).toBe(404);
    });

    it('should return 400 if rental is already processed', async () => {
        rental.dateReturn = new Date();
        await rental.save();

        const res = await exec();

        expect(res.status).toBe(400);
    });

    it('should return 200 if valid rental is provided', async () => {

        const res = await exec();

        expect(res.status).toBe(200);
    });

    it('should set returndate if valid rental is provided', async () => {

        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
        const diff = new Date() - rentalInDB.dateReturn;
        expect(diff).toBeLessThan(10 * 1000);
    });

    it('should set rentalFee if valid rental is provided', async () => {
        rental.dateOut = moment().add(-7, 'days').toDate();
        await rental.save();

        const res = await exec();

        const rentalInDB = await Rental.findById(rental._id);
        expect(rentalInDB.rentalFee).toBe(70);
    });

    it('should increase the stock if valid rental is provided', async () => {
        const res = await exec();

        const movieInDB = await Movie.findById(movieId);
        expect(movieInDB.numberInStock).toBe(movie.numberInStock + 1);
    });

    it('should return rental if valid rental is provided', async () => {
        const res = await exec();

        const rentalInDB = await Rental.findById(movieId);
        expect(Object.keys(res.body)).toEqual(expect.arrayContaining([
            'movie', 'customer', 'rentalFee', 'dateReturn', 'dateOut',
        ]))
    });


})