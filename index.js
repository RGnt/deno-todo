import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { v4 } from "https://deno.land/std/uuid/mod.ts";

const app = new Application();
const router = new Router();

let todos = [
    {
        guid: "e292c716-3790-4dab-8163-f1562570a34b",
        task: "Write a ToDo API",
        isComplete: false
    },
    {
        guid: "eafd629f-b80e-4539-8cbd-016776e5800e",
        task: "Test ToDo API",
        isComplete: false
    },
    {
        guid: "1790009e-e878-4068-8375-9be7a1409487",
        task: "Finish a stream",
        isComplete: false
    },
];

const getTodos = ({response, params}) => {
    let body = {}
    if(params.id) {
        if(todos.find(todo => todo.guid === params.id)) {
            body = {success: true, data: todos.find(todo => todo.guid == params.id)}
        } else {
            response.status = 400;
            body = {success: false, message: "Not found"}
        }
    } else {
        body = {success: true, data: todos}
    }
    response.body = body;
}

const postTodo = async(ctx) => {
    let body = await ctx.request.body();
    todos.push({guid: v4.generate(), task: body.value.task, isComplete: body.value.isComplete});
    ctx.response.body = {success: true}
}

const toggleComplete = async(ctx) => {
    if(todos.find(todo => todo.guid === ctx.params.id)) {
        const index = todos.findIndex(todo => todo.guid === ctx.params.id)
        todos[index].isComplete = !todos[index].isComplete;
        ctx.response.body = {success: true}
    } else {
        ctx.response.status = 400;
        ctx.response.body = {success: false, message: "ToDo does not exist"}
    }
}

const deleteTodo = async(ctx) => {
    if(todos.find(todo => todo.guid === ctx.params.id)) {
        todos = todos.filter(todo => todo.guid !== ctx.params.id);
        ctx.response.body = {success: true}
    } else {
        ctx.response.status = 400;
        ctx.response.body = {success: false, message: "ToDo does not exist"}
    }
}

router.get("/api/v1/todos", getTodos)
      .get("/api/v1/todos/:id", getTodos)
      .post("/api/v1/todos/", postTodo)
      .put("/api/v1/todos/:id", toggleComplete)
      .delete("/api/v1/todos/:id", deleteTodo);

app.use(router.routes());

await app.listen({ port: 8000 });