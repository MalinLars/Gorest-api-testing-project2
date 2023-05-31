import supertest from 'supertest';
import {expect} from 'chai';
import dotenv from 'dotenv';

dotenv.config();

describe('Negative tests for all routes', () => {
    const request  = supertest('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;
    let id = 0;

    it('GET /posts/:id | Negative', async () => {
        const res = await request.get(`posts/${id}`);
        expect(res.body.message).to.equal('Resource not found');
    });

    it('DELETE /posts/:id | Negative', async () => {
        const res = await request.delete(`posts/${id}`);
        expect(res.status).to.equal(404);
    });
    
    it('POST /users | Negative', async () => {
        const post = {}
        const res = await request.post('users').set('Authorization', `Bearer ${token}`).send(post);
        expect(res.status).to.equal(422);
    });

    it('PUT /users/:id | Negative', async () => {
        const update = {};
        const res = await request.post(`users/${id}`).set('Authorization', `Bearer ${token}`).send(update);
        expect(res.status).to.equal(404);
    });
});