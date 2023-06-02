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

  /* Tests */
    // GET all todos
    it('GET /todos', async() => {
        const res = await request.get('todos');

        expect(res.body).to.not.be.empty;
        expect(res.status).to.eql(200);
    });

    // GET todos with specified (filtered) parameters
    it('GET /todos | Query parameters - get completed todos', async () => {
        const url = `todos?access-token=${token}&due_on=2023-06-04T00:00:00.000+05:30&status=completed`;
        const res = await request.get(url);

        // Loop over each result
        res.body.forEach((todo) => {
            expect(todo.due_on).to.eq('2023-06-05T00:00:00.000+05:30');
            expect(todo.status).to.eq('completed');
        });
    });

    // POST - Create new todo
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
    }); 

    // GET single todo that was just created
    it('GET /todos/:id | User just created', async () => {
        const res = await request.get(`todos/${todoId}?access-token=${token}`);

        expect(res.body.id).to.eq(todoId);
    });

    // PUT - Edit the status of the todo using the PUT method. The entire data is resent.
    it('PUT /todos/:id | Update todo status', async () => {
        const data = {
            status: 'completed'
        };

        const res = await request.put(`todos/${todoId}`)
            .set('Authorization', `Bearer ${token}`)
            .send(data);
            
            expect(res.body.status).to.equal(data.status);
            expect(res.body).to.include(data);
            expect(res.status).to.eq(200);
            expect(res.body).to.have.property('status', 'completed');
    });

    // PATCH - Edit the title of a todo using the PATCH method. Only the title is updated without all data resent.
    it('PATCH /todos/:id | Update todo title', async () => {
        const data = {
            title: 'This title has been updated'
        };

        const res = await request.patch(`todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`)
        .send(data);

        expect(res.body.title).to.equal(data.title);
        expect(res.status).to.eq(200);
        expect(res.body).to.have.property('title', 'This title has been updated');
        expect(res.body).to.be.an('object');
    }); 

    // DELETE single todo
    it('DELETE /todos/:id', async () => {
        const res = await request.delete(`todos/${todoId}`)
        .set('Authorization', `Bearer ${token}`);
        expect(res.body).to.be.empty;
        expect(res.status).to.eql(204);
    });

    it('DELETE /todos/:id | Negative', async () => {
        const res = await request.delete(`todos/${todoId}`);
        expect(res.status).to.equal(404);
    });

    it('POST /todos | Negative', async () => {
        const emptyTodo = {};
        const res = await request.post('todos').set('Authorization', `Bearer ${token}`).send(emptyTodo);
        expect(res.status).to.equal(422);
    });

    // Clean up after executing tests
    after(async () => {
        const res = await request
          .delete(`users/${userId}`)
          .set("Authorization", `Bearer ${token}`);

         // Confirm that the test data is empty and cleaned 
        expect(res.body).to.be.empty;
      });
});