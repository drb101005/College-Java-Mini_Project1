// server.js
const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

(async () => {
  // Open SQLite DB
  const db = await open({
    filename: "./studentoverflow.db",
    driver: sqlite3.Database
  });

  // Create tables if not exist
  await db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      username TEXT UNIQUE,
      displayName TEXT,
      role TEXT
    );

    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT,
      description TEXT,
      tags TEXT,
      author TEXT,
      votes INTEGER DEFAULT 0,
      views INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS answers (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      questionId INTEGER,
      text TEXT,
      author TEXT,
      votes INTEGER DEFAULT 0,
      createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (questionId) REFERENCES questions(id)
    );
  `);

  console.log("✅ Database initialized");

  // ------------------ API Routes ------------------ //

  // Get all questions
  app.get("/questions", async (req, res) => {
    const rows = await db.all("SELECT * FROM questions ORDER BY createdAt DESC");
    const formatted = rows.map(q => ({
      ...q,
      tags: q.tags ? q.tags.split(",") : []
    }));
    res.json(formatted);
  });

  // Get single question + answers
  app.get("/questions/:id", async (req, res) => {
    const { id } = req.params;
    const question = await db.get("SELECT * FROM questions WHERE id = ?", id);
    if (!question) return res.status(404).json({ error: "Not found" });

    const answers = await db.all("SELECT * FROM answers WHERE questionId = ? ORDER BY createdAt DESC", id);
    res.json({
      ...question,
      tags: question.tags ? question.tags.split(",") : [],
      answers
    });
  });

  // Post a new question
  app.post("/questions", async (req, res) => {
    const { title, description, tags, author } = req.body;
    if (!title || !description) return res.status(400).json({ error: "Missing fields" });

    const result = await db.run(
      "INSERT INTO questions (title, description, tags, author) VALUES (?, ?, ?, ?)",
      [title, description, tags.join(","), author]
    );
    res.json({ id: result.lastID, title, description, tags, author });
  });

  // Post a new answer
  app.post("/questions/:id/answers", async (req, res) => {
    const { id } = req.params;
    const { text, author } = req.body;
    if (!text) return res.status(400).json({ error: "Missing answer text" });

    const result = await db.run(
      "INSERT INTO answers (questionId, text, author) VALUES (?, ?, ?)",
      [id, text, author]
    );
    res.json({ id: result.lastID, text, author });
  });

  // Start the server
  app.listen(5000, () => console.log("🚀 Server running at http://localhost:5000"));
})();
