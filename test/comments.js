import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { createRandomComment } from '../helpers/comment_helper';

dotenv.config();

describe('/comments route', () => {
    const request = supertest('https://gorest.co.in/public/v2');
    const token = process.env.USER_TOKEN;
    let postId = null;
    let commentId = null;

    /* Tests */

    // Get all comments
    it('GET / comments', async () => {
        const res = await request.get('/comments');
        expect(res.body).to.not.be.empty;
        expect(res.status).to.equal(200);
    });  

    // Get 1 comment
    it('GET / 1 comment', async () => {
        const res = await request.get('/comments/36351')
        expect(res.body.post_id).to.equal(39219);
      
    });

    // Post  a new comment
    it('POST / comments', async () => {
        // retrieves list of posts - finds id of the first post and assigns to postId
        const response = await request.get('/posts');
        postId = response.body[0].id;
            
        const data = createRandomComment(postId);
        const res = await request.post('/comments')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
          
        expect(res.status).to.equal(201);
        expect(res.body).to.have.property('name');

        // Store id in commentId for later use
        commentId = res.body.id;
              
        });

    it('GET /comments/:id | comment just created', async () => {
        const res = await request.get(`/comments/${commentId}?access-token=${token}`);
        expect(res.body.id).to.eq(commentId);
        });

        // Change created comment
    it('PUT /change input for created comment', async () => {
        const data = {
            name: 'Name changed',
            email: 'emailchanged@jenseneducation.se',
            body: 'Body changed'
        };

         const res = await request.put(`/comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);

         expect(res.body.name).to.eq('Name changed');
         expect(res.body.email).to.eq('emailchanged@jenseneducation.se');
         expect(res.body.body).to.eq('Body changed');
         expect(res.status).to.equal(200);
       

         });
         // Change parts of created comment
         it('PATCH / change 1 input for created comment', async () => {
            const data = {
                body: 'Body changed -again'
            };
            const res = await request.put(`/comments/${commentId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(data);

            expect(res.status).to.equal(200);
            expect(res.body.body).to.eq('Body changed -again');
         });

         // Delete created comment
         it('DELETE /comments/:id', async () => {
            const res = await request.delete(`/comments/ ${commentId}`)
             .set('Authorization', `Bearer ${token}`);
           
            expect(res.body).to.be.empty;
            expect(res.status).to.eq(204);
        });
 });

