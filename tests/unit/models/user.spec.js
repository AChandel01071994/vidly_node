const { User } = require('../../../models/user');
const jwt = require('jsonwebtoken');
const config = require('config');
const mongoose = require('mongoose');

describe('user.getAuthToken', () => {

    it('should return a valid jwt token', () => {
        const userData = {
            _id: new mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const user = new User(userData);

        const token = user.getAuthToken();
        const decoded = jwt.verify(token, config.get("jwtPrivateKey"));

        expect(decoded).toMatchObject(userData);

    })

})