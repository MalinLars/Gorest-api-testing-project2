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

    it('GET /todos | Query parameters - get completed todos', async () => {
        const url = `todos?access-token${token}&due_on=2023-06-04T00:00:00.000+05:30&status=completed`;
        const res = await request.get(url);

        // Loop over each result
        res.body.forEach((todo) => {
            expect(todo.due_on).to.eq('2023-06-05T00:00:00.000+05:30');
            expect(todo.status).to.eq('completed');
        });
    })

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
            status: 'completed'
        };

        const res = await request.put(`todos/${todoId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);
            expect(res.body.status).to.equal(data.status);
            expect(res.body).to.include(data);
            expect(res.status).to.eq(200);
            //console.log(res.body);
            //console.log(res.status);
    });

    it('DELETE /todos/:id', async () => {
        const res = await request.delete(`todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);
        expect(res.body.message).to.equal('Resource not found');
        expect(res.status).to.eql(204);
        //console.log(res.status);
    });
});