import { randTodo } from "@ngneat/falso";
import { randPost } from "@ngneat/falso";

export const createRandomTodo = (userId) => {
    const todo = {
        user_id: userId,
        title: randTodo().title,
        due_on: '2023-06-04T00:00:00.000+05:30',
        status: 'pending'
    };
    return todo;
}

export const createRandomPost = (userId) => {
    const post = {
        user_id: userId,
        title: randPost().title,
        body: randPost().body
    };

    return post;
}