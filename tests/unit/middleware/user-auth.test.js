const { User } = require('../../../models/user');
const mongoose = require('mongoose');
const userAuth = require('../../../middlewares/user-auth');

describe('user-auth middleware', () => {
    it('should populate the req.user with valid payload of jwt token', () => {
        const user = {
            _id: mongoose.Types.ObjectId().toHexString(),
            isAdmin: true
        };
        const jwt = new User(user).getAuthToken();

        const req = {
            header: jest.fn().mockReturnValue(jwt)
        }
        const res = {};
        const next = jest.fn(); 
        userAuth(req, res, next);

        expect(req.user).toMatchObject(user);
        expect(next).toBeCalled();   
    })
})