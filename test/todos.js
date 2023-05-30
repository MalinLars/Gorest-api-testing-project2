import supertest from "supertest";
import { expect } from "chai";
import dotenv from 'dotenv';
import { createRandomUser } from "../helpers/user_helper";
import { createRandomTodo, createRandomPost } from "../helpers/todo_helper";


// Configuration
dotenv.config();

// Setup and Mocha Tests for Todos
describe('/todos route', () => {
    // Setup
    const request = supertest('https://gorest.co.in/public/v2/');
    const token = process.env.USER_TOKEN;

    let userId = null;
    let todoId = null; 


   before(async () => {
        const res = await request.post('users').set("Authorization", `Bearer ${token}`).send(createRandomUser());
        userId = res.body.id;
    });

    

  // Tests
    it('GET /todos', async() => {
        const res = await request.get('todos');
        //console.log(res.body);
        expect(res.body).to.not.be.empty;
        expect(res.status).to.eql(200);
        //userId = res.body.data[0].user_id;
        
    });

    it('POST /todos', async function() {
        this.retries(4);
        const data = createRandomTodo(userId);
        const res = await request.post('todos')
            .set('Authorization', `Bearer ${token}`)
            .send(data);

        // Get back the id of the todo we just created to use later
        expect(res.body).to.include(data);
        expect(res.body).to.have.property('id');
        expect(res.status).to.eql(201);
        todoId = res.body.id;
        console.log(res.body);
    }); 

    it('GET /todos/:id | User just created', async () => {
        const res = await request.get(`todos/${todoId}?access-token=${token}`);
        expect(res.body.id).to.eq(todoId);
    });

    it('PUT /todos/:id', async () => {
        const data = {
            status: 'complete'
        };

        const res = await request.put(`users/${userId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);
            console.log(data);
    });


});