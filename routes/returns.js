const express = require('express');
const router = express.Router();
const { Rental } = require('../models/rentals');
const { Movie } = require('../models/movies');
const userAuth = require('../middlewares/user-auth');
const Joi = require('joi');
const validator = require('../middlewares/validator');

router.post('/', [userAuth, validator(validateReturn)], async (req, res) => {
    const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

    // const rental = await Rental.findOne({
    //     'customer._id': req.body.customerId,
    //     'movie._id': req.body.movieId
    // });

    if (!rental) return res.status(404).send('No rental found');
    if (rental.dateReturn) return res.status(400).send('Rental already processed.');

    rental.return();

    await rental.save();

    await Movie.update({ _id: req.body.movieId }, {
        $inc: {
            numberInStock: 1
        }
    });

    res.status(200).send(rental);
});

module.exports = router;

function validateReturn(req) {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required(),
    };

    return Joi.validate(req, schema);
}