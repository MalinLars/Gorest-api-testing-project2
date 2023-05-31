import supertest from "supertest";
import { expect } from "chai";
import dotenv from 'dotenv';
import { createRandomUser } from "../helpers/user_helper";
import { buildExternalHelpers } from '@babel/core';

// Configuration
dotenv.config();

describe.only('/users route', () => {

    // Request
    const request = supertest ('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;
    
    let userID = null;

    it('GET /users', async () => {
        const res = await request.get('users');
        //console.log(res.body);
        expect(res.body).to.not.be.empty;
    });

    it('GET /users | query parameters - get inactive users', async () => {
       
        const url ='users?gender=male&status=inactive';
        const res = await request.get(url);

        //console.log(res.body);

        res.body.forEach((user) => {
            
            expect(user.gender).to.eq('male');
            expect(user.status).to.eq('inactive');
            
        });

    });

    it('POST /users', async () => {
        const data = createRandomUser();

        const res = await request
            .post('users')
            .set('Authorization', `Bearer ${token}`)
            .send(data);
        
        console.log(res.body);
        expect(res.body).to.include(data);
        expect(res.body).to.have.property('id');
        expect(res.body).to.have.property('gender');

        expect(res.status).to.eq(201);
        
        userID = res.body.id;
    });

   it('GET /users/:id | User we just created', async () => {
        const res = await request.get(`users/${userID}?access-token=${token}`);
        console.log(res.body);
    });
    it('PUT /users/:id');
    it('DELETE /users/:id | User we just created');


})
