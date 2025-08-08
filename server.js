const express = require("express");
require("dotenv").config();
const app = express();
const port = process.env.PORT;

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// In-memory database for todos
let todos = [
  { id: 1, task: "Belajar Node.js", completed: false },
  { id: 2, task: "Buat aplikasi TODO", completed: false },
];

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// GET all todos (API endpoint)
app.get("/todos", (req, res) => {
  res.json(todos);
});

// GET todos page
app.get("/todos-list", (req, res) => {
  res.render("todos-page", { todos: todos });
});

// POST - Create a new todo
app.post("/todos", (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }
  
  const newTodo = {
    id: todos.length > 0 ? Math.max(...todos.map(t => t.id)) + 1 : 1,
    task,
    completed: false
  };
  
  todos.push(newTodo);
  res.status(201).json(newTodo);
});

// PUT - Update a todo
app.put("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  const { task } = req.body;
  
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  
  todos[todoIndex].task = task;
  res.json(todos[todoIndex]);
});

// PATCH - Mark todo as complete
app.patch("/todos/:id/complete", (req, res) => {
  const id = parseInt(req.params.id);
  
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  
  todos[todoIndex].completed = true;
  res.json(todos[todoIndex]);
});

// DELETE - Remove a todo
app.delete("/todos/:id", (req, res) => {
  const id = parseInt(req.params.id);
  
  const todoIndex = todos.findIndex(t => t.id === id);
  if (todoIndex === -1) {
    return res.status(404).json({ error: "Todo not found" });
  }
  
  todos = todos.filter(t => t.id !== id);
  res.json({ message: "Todo deleted successfully" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});