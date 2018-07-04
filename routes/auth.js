const express = require('express');
const router = express.Router();
const Joi = require('joi');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const config = require('config');
const { User } = require('../models/user');
const bcrypt = require('bcrypt');
const validator = require('../middlewares/validator');


router.post('/', validator(validateUser), async (req, res) => {

    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(400).send('Invalid username or password');

    const isValid = await bcrypt.compare(req.body.password, user.password);
    if (!isValid) return res.status(400).send('Invalid username or password');

    const token = user.getAuthToken();
    res.send(token);

})

function validateUser(req) {
    const userSchema = {
        email: Joi.string().email().min(5).max(255).required(),
        password: Joi.string().min(5).max(50).required()
    }

    return Joi.validate(req, userSchema);
}


module.exports = router;