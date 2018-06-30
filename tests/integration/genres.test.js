let server;
const request = require('supertest');
const { Genre } = require('../../models/genres');
const { User } = require('../../models/user');
const mongoose = require('mongoose');


describe('/api/genres', () => {
    beforeEach(() => { server = require('../../index') });
    afterEach( async() => { 
         server.close();
        await Genre.remove({});
    }); 

    describe('GET/', () => {
        it('it should return all genres', async () => {
            Genre.insertMany([
                { name: 'Genre1' },
                { name: 'Genre2' }
            ]);

            const res = await request(server).get('/api/genres');

            expect(res.status).toBe(200);
            expect(res.body.length).toBe(2);
            expect(res.body.some(a => a.name == 'Genre1')).toBeTruthy();
        })
    })

    describe('GET /:id', () => {
        it('should return status 404 if genre with given id is not found', async () => {

            const res = await request(server).get(`/api/genres/1`);
            expect(res.status).toBe(404);
        });

        it('should return a genre for given valid Id', async () => {
            // const id = new mongoose.Types.ObjectId().toHexString();
            const genre = new Genre({
                name: 'Genre1'
            })
            await genre.save();
            const res = await request(server).get(`/api/genres/${genre._id}`);
            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('name', genre.name);
        });
    })

    describe('POST /', () => {
        let jwt;
        let genre;
        const clientRequest = () => {
            return request(server)
                .post('/api/genres')
                .set('x-auth-token', jwt)
                .send(genre);
        }

        beforeEach(() => {
            jwt = new User().getAuthToken();
            genre = { name: 'Genre1' };
        })

        it('should return 401 if user is not valid', async () => {
            jwt = '';
            const res = await request(server).post('/api/genres')
                .send({ name: 'Genre1' });
            expect(res.status).toBe(401);
        })

        it('should return 400 if genre is less than 5 characters', async () => {
            genre.name = '1234'
            const res = await clientRequest();
            expect(res.status).toBe(400);
        })

        it('should return 400 if  genre is more than 50 characters', async () => {

            genre.name = new Array(52).join('a');
            const res = await clientRequest();
            expect(res.status).toBe(400);
        })


        it('should save the genre if it is valid', async () => {
            const res = await clientRequest();
            const genre1 = await Genre.find({ name: genre.name });

            expect(res.status).toBe(200);
            expect(res.body).toHaveProperty('_id');
            expect(res.body).toHaveProperty('name');
            expect(genre1).not.toBeNull();
        })
    })
})