const request = require('supertest');
const { User } = require('../../../models/user');
const { Genre } = require('../../../models/genres');
let server;

describe('user-auth middleware', () => {

    let jwt;
    let genre;
    beforeEach(() => {
        server = require('../../../index');
    });

    afterEach(async () => {
         await server.close();
        await Genre.remove({});
    });
    
    beforeEach(() => {
        jwt = new User().getAuthToken();
        genre = { name: 'Genre1' };
    });

    const clientRequest = () => {
        return request(server)
            .post('/api/genres')
            .set('x-auth-token', jwt)
            .send(genre);
    }

    it('should return 401 if token is not provided', async () => {
        jwt = '';

        const res = await clientRequest();

        expect(res.status).toBe(401);
    })
    it('should return 400 if invalid token is provided', async () => {
        jwt = 'a';

        const res = await clientRequest();

        expect(res.status).toBe(400);
    })
    it('should return 200 if token is valid', async () => { 
        const res = await clientRequest();

        expect(res.status).toBe(200);
    })
})



