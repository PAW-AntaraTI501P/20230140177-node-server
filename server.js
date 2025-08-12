require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 3001;
const db = require("./database/db");

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set("view engine", "ejs");

// Routes
app.get("/", (req, res) => {
  res.render("index");
});

app.get("/contact", (req, res) => {
  res.render("contact");
});

// GET all todos (API endpoint)
app.get("/todos", (req, res) => {
  db.query("SELECT * FROM todos", (err, results) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    res.json(results);
  });
});

// GET todos view page
app.get("/todo-view", (req, res) => {
  db.query("SELECT * FROM todos", (err, todos) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).send("Internal server error");
    }
    res.render("todo", { todos });
  });
});

// POST - Create a new todo
app.post("/todos", (req, res) => {
  const { task } = req.body;
  if (!task) {
    return res.status(400).json({ error: "Task is required" });
  }

  db.query("INSERT INTO todos (task) VALUES (?)", [task], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Failed to save to database" });
    }
    res.status(201).json({
      id: result.insertId,
      task,
      completed: false
    });
  });
});

// PUT - Update a todo
app.put("/todos/:id", (req, res) => {
  const id = req.params.id;
  const { task } = req.body;

  db.query(
    "UPDATE todos SET task = ? WHERE id = ?",
    [task, id],
    (err, result) => {
      if (err) {
        console.error("Database error:", err);
        return res.status(500).json({ error: "Database error" });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Todo not found" });
      }
      res.json({ id, task });
    }
  );
});

// DELETE - Remove a todo
app.delete("/todos/:id", (req, res) => {
  const id = req.params.id;

  db.query("DELETE FROM todos WHERE id = ?", [id], (err, result) => {
    if (err) {
      console.error("Database error:", err);
      return res.status(500).json({ error: "Database error" });
    }
    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Todo not found" });
    }
    res.json({ message: "Todo deleted successfully" });
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send("404 - Page not found");
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});