import supertest from 'supertest';
import { expect } from 'chai';
import dotenv from 'dotenv';
import { createRandomComment } from '../helpers/comment_helper';

dotenv.config();

describe('/comments route', () => {
    const request = supertest('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;
    let postId = null;
    let commentId = null;

    /* Tests */

    // GET all comments
    it('GET /comments | Retrieve all comments', async () => {
        const res = await request.get('comments');
        expect(res.status).to.equal(200);
        expect(res.body).to.be.an('array').that.is.not.empty;
    });  

    // GET single comment with ID
    it('GET /comments/:id | Retrieve specific comment', async () => {
        const res = await request.get('comments/50162')
        expect(res.body.post_id).to.equal(61043);
        
    });

    // Post a new comment connected to a post_id
    it('POST /comments | Create new comment ', async () => {
        // Retrieves list of posts - finds id of the first post and assigns to postId
        const response = await request.get('posts');
        postId = response.body[0].id;
            
        const data = createRandomComment(postId);
        const res = await request.post('comments')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
          
        expect(res.status).to.equal(201);
        expect(res.body).to.have.all.keys('id', 'post_id', 'name', 'email', 'body');

        // Store ID in commentId for future use
        commentId = res.body.id;
              
        });

    it('GET /comments/:id | Retrieve created comment', async () => {
        const res = await request.get(`comments/${commentId}?access-token=${token}`);
        expect(res.body.id).to.eq(commentId);
        });

        // Update name, email and body in posted comment
    it('PUT /comments/:id | Update comment', async () => {
        const data = {
            name: 'Name changed',
            email: 'emailchanged@jenseneducation.se',
            body: 'Body changed'
        };

        const res = await request.put(`comments/${commentId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);

         expect(res.body.name).to.eq('Name changed');
         expect(res.body.email).to.eq('emailchanged@jenseneducation.se');
         expect(res.body.body).to.eq('Body changed');
         expect(res.status).to.equal(200);
         });

         // Update body in posted comment
         it('PATCH /comments/:id | Partially update comment', async () => {
            const data = {
                body: 'Body changed -again'
            };
            const res = await request.put(`comments/${commentId}`)
                .set('Authorization', `Bearer ${token}`)
                .send(data);

            expect(res.status).to.equal(200);
            expect(res.body.body).to.eq('Body changed -again');
         });

         // Delete posted comment
         it('DELETE /comments/:id | Delete comment', async () => {
            const res = await request.delete(`comments/ ${commentId}`)
             .set('Authorization', `Bearer ${token}`);
           
            expect(res.body).to.be.empty;
            expect(res.status).to.eq(204);
        });

        it('Get /comments/:id | Negative', async () => {
            const res = await request.get(`comments/${commentId}`);
            expect(res.body.message).to.equal('Resource not found');
        });
    
        it('PATCH /comments/:id | Negative', async () => {
            const emptyComment = {};
            const res = await request.patch(`comments/${commentId}`).set('Authorization', `Bearer ${token}`).send(emptyComment);
            expect(res.body.message).to.equal('Resource not found');
        });
 });

