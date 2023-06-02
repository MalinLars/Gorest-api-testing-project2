// Swapnal Tests

import supertest from "supertest";
import { expect } from "chai";
import dotenv from 'dotenv';
import { createRandomUser } from "../helpers/user_helper";


// Configuration
dotenv.config();

describe('/users route', () => {

    // Request
    const request = supertest ('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;
    
    let userID = null;

    /* Tests */

    // GET all users
    it('GET /users', async () => {
        const res = await request.get('users');
        
        expect(res.body).to.not.be.empty;
    });

    // Get all users with filters geneder: male & status: inactive
    it('GET /users | query parameters - get inactive users', async () => {
       
        const url ='users?gender=male&status=inactive';
        const res = await request.get(url);

        res.body.forEach((user) => {
            
            expect(user.gender).to.eq('male');
            expect(user.status).to.eq('inactive');
            
        });

    });

    // Post new user
    it('POST /users', async () => {
        const data = createRandomUser();
        
        const res = await request
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        
        
        expect(res.body).to.include(data);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('gender');

        expect(res.status).to.eq(201);
        
        // Save userID for future use
        userID = res.body.id;
    });

    // Get user we created
    it('GET /users/:id | User we just created', async () => {
        const res = await request.get(`users/${userID}?access-token=${token}`);
        
        expect(res.body.id).to.eq(userID);
    });

    // PUT update name of the user we recently created
    it('PUT /users/:id', async () => {

        const data = {
            name : 'Test Supersson'
        };

        const res = await request.put(`users/${userID}`)
                .set('Authorization', `Bearer ${token}`)
                .send(data);
        
        expect(res.body.name).to.equal(data.name);
        expect(res.body).to.include(data);
        expect(res.status).to.eq(200);

    });

    //PATCH update status of the user we recently created
    it('PATCH/users/:id | update a status: of user we created', async () => {

        const patchData = {
            status : 'inactive'
        };

        const res = await request.patch(`users/${userID}`)
        .set('Authorization', `Bearer ${token}`)
        .send(patchData);

        expect(res.body.status).to.eq(patchData.status);

    });

    // DELETE user we recently created
    it('DELETE /users/:id | User we just created', async () => {
        const res = await request.delete(`users/${userID}`)
                .set('Authorization', `Bearer ${token}`);

        expect(res.body).to.empty;
        expect(res.status).to.eq(204);
    });

    it('POST /users | Negative', async () => {
        const emptyUser = {};
        const res = await request.post('users').set('Authorization', `Bearer ${token}`).send(emptyUser);
        expect(res.status).to.equal(422);
    });

    it('PUT /users/:id | Negative', async () => {
        const emptyUser = {};
        const res = await request.post(`users/${userID}`).set('Authorization', `Bearer ${token}`).send(emptyUser);
        expect(res.status).to.equal(404);
    });
});
