// backend/server.js
const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(bodyParser.json());

// DB setup
let db;
(async () => {
  db = await open({
    filename: "./app.db",
    driver: sqlite3.Database,
  });

  // Users
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      password TEXT,
      role TEXT,
      displayName TEXT
    )
  `);

  // Questions
  await db.exec(`
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      tags TEXT,
      userId INTEGER,
      upvotes INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Answers
  await db.exec(`
    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId INTEGER,
      content TEXT,
      userId INTEGER,
      upvotes INTEGER DEFAULT 0,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  console.log("✅ Database initialized");
})();

// ---------------- USERS ----------------

// Signup
app.post("/api/signup", async (req, res) => {
  const { username, password, role, displayName } = req.body;
  try {
    await db.run(
      "INSERT INTO users (username, password, role, displayName) VALUES (?, ?, ?, ?)",
      [username, password, role, displayName]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: "User already exists or DB error" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  const user = await db.get(
    "SELECT * FROM users WHERE username = ? AND password = ?",
    [username, password]
  );
  if (user) {
    res.json(user);
  } else {
    res.status(401).json({ error: "Invalid credentials" });
  }
});

// ---------------- QUESTIONS ----------------

// Add question
app.post("/api/questions", async (req, res) => {
  const { title, description, tags, userId } = req.body;
  try {
    await db.run(
      "INSERT INTO questions (title, description, tags, userId) VALUES (?, ?, ?, ?)",
      [title, description, tags, userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add question" });
  }
});

// Get all questions
app.get("/api/questions", async (req, res) => {
  const questions = await db.all(`
    SELECT q.*, u.username, u.displayName
    FROM questions q
    JOIN users u ON q.userId = u.id
    ORDER BY q.createdAt DESC
  `);
  res.json(questions);
});

// Upvote question
app.post("/api/questions/:id/upvote", async (req, res) => {
  const { id } = req.params;
  await db.run("UPDATE questions SET upvotes = upvotes + 1 WHERE id = ?", [id]);
  res.json({ success: true });
});

// ---------------- ANSWERS ----------------

// Add answer
app.post("/api/answers", async (req, res) => {
  const { questionId, content, userId } = req.body;
  try {
    await db.run(
      "INSERT INTO answers (questionId, content, userId) VALUES (?, ?, ?)",
      [questionId, content, userId]
    );
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ error: "Failed to add answer" });
  }
});

// Get answers for a question
app.get("/api/answers/:questionId", async (req, res) => {
  const { questionId } = req.params;
  const answers = await db.all(
    `SELECT a.*, u.username, u.displayName
     FROM answers a
     JOIN users u ON a.userId = u.id
     WHERE a.questionId = ?
     ORDER BY a.createdAt ASC`,
    [questionId]
  );
  res.json(answers);
});

// Upvote answer
app.post("/api/answers/:id/upvote", async (req, res) => {
  const { id } = req.params;
  await db.run("UPDATE answers SET upvotes = upvotes + 1 WHERE id = ?", [id]);
  res.json({ success: true });
});

// ---------------- SERVER START ----------------

app.listen(PORT, () => {
  console.log(`✅ Backend running at http://localhost:${PORT}`);
});
