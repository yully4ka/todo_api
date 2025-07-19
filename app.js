import express from "express";
import tasks from './data';
import lists from './list';

const app = express();
app.use(express.json());

const PORT = 3000;
app.listen(PORT, () => {
    console.info(`Server running on port ${PORT}`);
});

app.get('/api/v1/tasks', (request, response) => {
    response.json(tasks);
});

app.get('/api/v1/tasks/:id', (request, response) => {
    const id = request.params.id;
    const task = tasks.find(t => t.id == id);

    if (task) {
        response.json(task);
    } else {
        response.status(404).send(`Task with id '${id}' not found.`);
    }
});

app.post('/api/v1/tasks', (request, response) => {
    const task = request.body;

    if (!task.hasOwnProperty('id') ||
        !task.hasOwnProperty('title') || 
        !task.hasOwnProperty('done') || 
        !task.hasOwnProperty('listId')) {
            return response.status(400).send('A task needs the following properties: id, title, done and list.');
    }

    if (tasks.find(t => t.id == task.id)) {
            response.status(400).send(`A task with id '${task.id}' already exists.`);
    } else {
        tasks.push(task);
      	response.status(201);
        response.location('tasks/' + task.id);
        response.send();
    }
});

app.delete('/api/v1/tasks/:id', (request, response) => {
    const id = request.params.id;
    const index = tasks.findIndex(t => t.id == id); 
    if (index != -1) {
        tasks.splice(index, 1);
        response.json(tasks);
    } else {
        response.status(404).send(`Failed to delete task with id '${id}'. Task not found.`);
    }
});

//Henter en bestemt liste
app.get('/api/v1/lists/:listId', (request, response) => {
    const listId = request.params.listId;
    const list = lists.find(l => l.listId == listId);

    if (list) {
        response.json(list);
    } else {
        response.status(404).send(`List with id '${listId}' not found.`);
    }
});

app.post('/api/v1/lists', (request, response) => {
    const list = request.body;

    if (!list.hasOwnProperty('listId') ||
    !list.hasOwnProperty('title')) {
        response.status(400).send('A list needs the following properties: id and title.');
    }

    if (lists.find(l => l.listId == list.listId)) {
        response.status(400).send(`A list with id '${list.listId}' already exists.`);
    } else {
        lists.push(list);
        response.status(201);
        response.location('lists/' + list.listId);
        response.send();
    }
});

//Slett en gitt liste og dens oppgaver
app.delete('/api/v1/lists/:listId', (request, response) => {
    const id = request.params.listId;
    const index = lists.findIndex(l => l.listId == id);
    if (index != -1) {
        lists.splice(index, 1);
        response.json(lists);

        tasks.forEach((task) => {
            if (task.listId == id) {
                const taskIndex = tasks.findIndex(t => t.listId == id);
                tasks.splice(taskIndex, 1);
        }
    });
   } else {
        response.status(404).send(`Failed to delete list with id '${listId}'. List not found.`);
    }
});

//Hent alle oppgaver for en gitt liste
app.get('/api/v1/lists/:listId/tasks', (request, response) => {
    const listId = request.params.listId;
    const list = lists.find(l => l.listId == listId);

    if (list) {
        let taskList = [];
        tasks.forEach((task) => {
        if(task.listId == listId) {
            taskList.push(task);
        }
      });
    response.json(taskList);

    } else {
        response.status(404).send(`List with id '${listId}' not found.`);
    }
});

//Hent en bestemt oppgave for en gitt liste
app.get('/api/v1/lists/:listId/tasks/:taskId', (request, response) => {
    const listId = request.params.listId;
    const list = lists.find(l => l.listId == listId);

    if (list) {
        const taskId = request.params.taskId;
        const task = tasks.find(t => t.id == taskId);

    if (task) {
        response.json(task);
    } else {
        response.status(404).send(`Task with id '${taskId}' not found in list '${listId}'`);
    }
    }
});

//Lag en ny oppgave for en gitt liste
app.post('/api/v1/lists/:listId/tasks', (request, response) => {
    const listId = request.params.listId;
    const task = request.body;
    task.listId = parseInt(listId);

    if (!task.hasOwnProperty('id') ||
    !task.hasOwnProperty('title') ||
    !task.hasOwnProperty('done')) {
        response.status(400).send('A task needs the following properties: id, title and done.');
    }

    if (tasks.find(t => t.id == task.id)) {
        response.status(400).send(`A task with id '${task.id}' already exists in list with id'${listId}'.`);
    } else {
        tasks.push(task);
        response.status(201);
        response.location('tasks/' + task.id);
        response.send();
    }
});

//Slett en gitt oppgave i en bestemt liste
app.delete('/api/v1/lists/:listId/tasks/:taskId', (request, response) => {
    const taskId = request.params.taskId;
    const listId = request.params.listId;

    const index = tasks.findIndex(t => t.id == taskId);
    if (index != -1) {
        if (tasks[index].listId == listId) 
        {
            tasks.splice(index, 1);
            response.json(tasks);
        }
        else {
            response.status(404).send(`Failed to delete task with id '${taskId}'. Task not found in list '${listId}'`);
        }
    
    } else {
        response.status(404).send(`Failed to delete task with id '${taskId}'. Task not found.`);
    }
    
});