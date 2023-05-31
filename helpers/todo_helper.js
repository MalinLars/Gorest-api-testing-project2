import { randTodo } from "@ngneat/falso";


export const createRandomTodo = (userId) => {
    const todo = {
        user_id: userId,
        title: randTodo().title,
        due_on: randTodo.due_on,
        status: 'pending'
    };
    return todo;
}

