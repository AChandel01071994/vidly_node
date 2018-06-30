const express = require('express');
const _ = require('lodash');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const config = require('config');
const userAuth = require('../middlewares/user-auth');
const router = express.Router();
const { User, validateUser } = require('../models/user');


router.get('/me', userAuth, async (req, res) => {
    const user = await User.findById(req.user._id).select('-password');
    return res.send(user);
})

router.post('/', async (req, res) => {
    const { error } = validateUser(_.pick(req.body, ['name', 'email', 'password']));
    if (error) return res.status(400).send(error.details[0].message);

    const user = await User.findOne({ email: req.body.email });
    if (user) return res.status(400).send('User Already exists.')

    try {
        const user = new User(_.pick(req.body, ['name', 'email', 'password'])); 
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(user.password, salt)
        await user.save();
        const token = user.getAuthToken();

        res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email']));
    } catch (error) {
        res.status(500).send(error);
    }
})

module.exports = router;