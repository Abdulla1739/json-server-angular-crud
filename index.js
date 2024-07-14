const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors());

const todoFile = './todos.json';

// Load todos from file
const loadTodos = () => {
  try {
    const dataBuffer = fs.readFileSync(todoFile);
    return JSON.parse(dataBuffer.toString());
  } catch (e) {
    return [];
  }
};

// Save todos to file
const saveTodos = (todos) => {
  fs.writeFileSync(todoFile, JSON.stringify(todos, null, 2));
};

app.get('/api/todos', (req, res) => {
  const todos = loadTodos();
  res.send(todos);
});

app.post('/api/todos', (req, res) => {
  const todos = loadTodos();
  const newTodo = req.body;
  todos.push(newTodo);
  saveTodos(todos);
  res.status(201).send(newTodo);
});

app.put('/api/todos/:id', (req, res) => {
  const todos = loadTodos();
  const id = parseInt(req.params.id, 10);
  const updatedTodo = req.body;

  const todoIndex = todos.findIndex(todo => todo.id === id);
  if (todoIndex !== -1) {
    todos[todoIndex] = updatedTodo;
    saveTodos(todos);
    res.send(updatedTodo);
  } else {
    res.status(404).send();
  }
});

app.delete('/api/todos/:id', (req, res) => {
  let todos = loadTodos();
  const id = parseInt(req.params.id, 10);
  todos = todos.filter(todo => todo.id !== id);
  saveTodos(todos);
  res.status(204).send();
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
