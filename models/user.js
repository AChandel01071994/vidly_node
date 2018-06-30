const mongoose = require('mongoose');
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const config = require('config');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 50,
        required: true
    },
    email: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 255,
        required: true,
        unique: true
    },
    password: {
        type: String,
        trim: true,
        minlength: 5,
        maxlength: 1024,
        required: true,
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

userSchema.methods.getAuthToken = function () {
    return jwt.sign({ _id: this._id, isAdmin: this.isAdmin }, config.get("jwtPrivateKey"));
}

const User = mongoose.model('User', userSchema);

const validateUser = (user) => {
    const userSchema = {
        name: Joi.string().min(5).max(50).required(),
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(50).required()
    }

    return Joi.validate(user, userSchema);
}

exports.User = User;

exports.validateUser = validateUser;
