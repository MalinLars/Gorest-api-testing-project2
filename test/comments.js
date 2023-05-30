import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { createRandomComment } from '../helpers/comment_helper';

dotenv.config();

describe('/comments route', () => {
    const request = supertest('https://gorest.co.in/public/v2');
    const token = process.env.USER_TOKEN;
    let postId = null;

    it('GET / comments', async () => {
        const res = await request.get('/comments');
        expect(res.body).to.not.be.empty;
    });  

    it('GET / comments', async () => {
        const response = await request.get('/comments');
        expect(response.status).to.equal(200);
    });

    it('GET / 1 comment', async () => {
        const res = await request.get('/comments/36351')
        expect(res.body.post_id).to.equal(39219);
      
    });

    it('POST / comments', async () => {
        const response = await request.get('/posts');
        expect(response.status).to.equal(200);
        postId = response.body[0].id;

        console.log(postId);

        const data = createRandomComment(postId);
        const res = await request
           .post('/comments')
           .set('Authorization', `Bearer ${token}`)
           .send(data);
          
           expect(res.status).to.equal(201);
           expect(res.body).to.have.property('name');
           console.log(res.body);
        });

    it('GET / comments', async() => {

    });

});