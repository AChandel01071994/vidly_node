const mongoose = require('mongoose');
const Joi = require('joi');

const customerSchema = new mongoose.Schema({
    isGold: {
        type: Boolean, 
        default : false
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
});

const Customer = mongoose.model('Customer', customerSchema);

function validate(customer) {
    const schema = {
        name: Joi.string().min(4).max(255).required(),
        phone: Joi.string().min(8).max(12).required(),
        isGold: Joi.boolean()
    }

    return Joi.validate(customer, schema);
}

exports.validate = validate;
exports.Customer = Customer;
