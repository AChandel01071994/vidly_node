const Joi = require('joi');
const mongoose = require('mongoose');
const moment = require('moment');

const rentalSchema = new mongoose.Schema({
    movie: {
        type: new mongoose.Schema({
            title: {
                type: String,
                minlength: 5,
                maxlength: 255,
                trim: true,
                required: true
            },
            dailyRentalRate: {
                type: Number,
                required: true,
                min: 0,
                max: 255
            }
        }),
        required: true
    },
    customer: {
        type: new mongoose.Schema({
            isGold: {
                type: Boolean,
                default: false
            },
            name: {
                type: String,
                minlength: 4,
                maxlength: 255,
                trim: true,
                required: true
            },
            phone: {
                type: String,
                minlength: 8,
                maxlength: 12,
                trim: true,
                required: true
            }
        }),
        required: true
    },
    dateOut: {
        type: Date,
        required: true,
        default: Date.now
    },
    dateReturn: {
        type: Date
    },
    rentalFee: {
        type: Number,
        min: 0
    }

});

rentalSchema.statics.lookup = function (customerId, movieId) {
    return this.findOne({
        'customer._id': customerId,
        'movie._id': movieId
    });
}

rentalSchema.methods.return = function () {
    this.dateReturn = new Date();

    const days = moment().diff(this.dateOut, 'days');
    const fee = days * this.movie.dailyRentalRate;
    this.rentalFee = fee;
}

const Rental = mongoose.model('Rental', rentalSchema);

const validateRental = (body) => {
    const schema = {
        customerId: Joi.objectId().required(),
        movieId: Joi.objectId().required()
    }

    return Joi.validate(body, schema);
}

exports.validate = validateRental;

exports.Rental = Rental;