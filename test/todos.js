import supertest from "supertest";
import { expect } from "chai";
import dotenv from 'dotenv';
//import { createRandomUser } from "../helpers/user_helper";
//import { createRandomTodo }

// Configuration
dotenv.config();

// Setup
    const request = supertest('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;

// Setup and Mocha Tests for Todos
describe('/todos route', () => {

    let userId = null;
/*
    before(async () => {
        const res = await request.post('users').set("Authorization", `Bearer ${token}`).send(createRandomUser());
        userId = res.body.data.id;
    }); */

    let todoId = null;

  /*  // Tests
    it('GET /todos', async() => {
        const res = await request.get('todos');
        console.log(res.info);
        //expect(res.body).to.not.be.empty;
        
        //userId = res.body.data[0].user_id;
        
    });*/

    it('GET todos', async() => {
        const res = await request.get('todos');
        //expect(res.body.data).to.not.be.empty;
        console.log(res.body);
        //userId = res.body.data[0].user_id;
    }); 

});