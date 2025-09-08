//Starts server on express 
//Connects Sqllite to db
//defines api routes
//db.sqlite is auto created locally
// server.js
const express = require("express");
const sqlite3 = require("sqlite3");
const { open } = require("sqlite");
const cors = require("cors");
const path = require("path");

const app = express();
app.use(express.json());
app.use(cors());

// simple request logger
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

let db;

(async () => {
  try {
    db = await open({
      filename: "./studentoverflow.db",
      driver: sqlite3.Database,
    });

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
    // --- Seed data if empty ---
const qCount = await db.get("SELECT COUNT(*) as count FROM questions");
if (qCount.count === 0) {
  console.log("🌱 Seeding database with sample questions...");

  const q1 = await db.run(
    "INSERT INTO questions (title, description, tags, author, votes, views) VALUES (?, ?, ?, ?, ?, ?)",
    ["What is React?", "Can someone explain React in simple terms?", "react,javascript", "Alice", 3, 120]
  );

  const q2 = await db.run(
    "INSERT INTO questions (title, description, tags, author, votes, views) VALUES (?, ?, ?, ?, ?, ?)",
    ["Best way to learn DSA?", "I am confused about how to start learning Data Structures and Algorithms.", "dsa,algorithms", "Bob", 5, 300]
  );

  const q3 = await db.run(
    "INSERT INTO questions (title, description, tags, author, votes, views) VALUES (?, ?, ?, ?, ?, ?)",
    ["SQL vs NoSQL?", "Which one should I use for my next project and why?", "sql,nosql,databases", "Charlie", 2, 150]
  );

  // Seed answers
  await db.run(
    "INSERT INTO answers (questionId, text, author, votes) VALUES (?, ?, ?, ?)",
    [q1.lastID, "React is a JavaScript library for building UIs.", "Dave", 2]
  );
  await db.run(
    "INSERT INTO answers (questionId, text, author, votes) VALUES (?, ?, ?, ?)",
    [q1.lastID, "Think of React as a way to build reusable UI components.", "Eve", 1]
  );
  await db.run(
    "INSERT INTO answers (questionId, text, author, votes) VALUES (?, ?, ?, ?)",
    [q2.lastID, "Start with arrays and linked lists, then move on to trees and graphs.", "Frank", 3]
  );
  await db.run(
    "INSERT INTO answers (questionId, text, author, votes) VALUES (?, ?, ?, ?)",
    [q3.lastID, "SQL is good for structured data, NoSQL for flexibility and scale.", "Grace", 2]
  );

  console.log("✅ Seed data inserted");
}


    // Root sanity route
    app.get("/", (req, res) => {
      res.json({ ok: true, msg: "StudentOverflow API running" });
    });

    // Get all questions with answers count and formatted "asked" date
    app.get("/questions", async (req, res) => {
      try {
        const rows = await db.all(`
          SELECT q.*,
                 COUNT(a.id) AS answersCount
          FROM questions q
          LEFT JOIN answers a ON a.questionId = q.id
          GROUP BY q.id
          ORDER BY q.createdAt DESC
        `);

        const formatted = rows.map(q => ({
          id: q.id,
          title: q.title,
          description: q.description,
          // return tags as ARRAY
          tags: q.tags ? q.tags.split(",").filter(t => t !== "") : [],
          author: q.author,
          votes: q.votes || 0,
          views: q.views || 0,
          answersCount: Number(q.answersCount) || 0,
          asked: q.createdAt ? new Date(q.createdAt).toLocaleString() : "",
        }));

        res.json(formatted);
      } catch (err) {
        console.error("GET /questions error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Get single question + answers
    app.get("/questions/:id", async (req, res) => {
      try {
        const { id } = req.params;
        const question = await db.get("SELECT * FROM questions WHERE id = ?", [id]);
        if (!question) return res.status(404).json({ error: "Not found" });

        const answers = await db.all(
          "SELECT * FROM answers WHERE questionId = ? ORDER BY createdAt DESC",
          [id]
        );

        res.json({
          ...question,
          tags: question.tags ? question.tags.split(",").filter(t => t !== "") : [],
          answers,
        });
      } catch (err) {
        console.error("GET /questions/:id error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Post a new question
    app.post("/questions", async (req, res) => {
      try {
        const { title, description, tags, author } = req.body;
        if (!title || !description) {
          return res.status(400).json({ error: "Missing title or description" });
        }
        const safeTags = Array.isArray(tags) ? tags.join(",") : (typeof tags === "string" ? tags : "");
        const result = await db.run(
          "INSERT INTO questions (title, description, tags, author) VALUES (?, ?, ?, ?)",
          [title, description, safeTags, author || "Anonymous"]
        );

        res.json({
          id: result.lastID,
          title,
          description,
          tags: Array.isArray(tags) ? tags : (tags ? tags.split(",") : []),
          author: author || "Anonymous",
        });
      } catch (err) {
        console.error("POST /questions error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Post a new answer
    app.post("/questions/:id/answers", async (req, res) => {
      try {
        const { id } = req.params;
        const { text, author } = req.body;
        if (!text) return res.status(400).json({ error: "Missing answer text" });

        const result = await db.run(
          "INSERT INTO answers (questionId, text, author) VALUES (?, ?, ?)",
          [id, text, author || "Anonymous"]
        );

        res.json({ id: result.lastID, text, author: author || "Anonymous" });
      } catch (err) {
        console.error("POST /questions/:id/answers error:", err);
        res.status(500).json({ error: "Internal server error" });
      }
    });

    // Start server
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
  } catch (err) {
    console.error("Failed to start server:", err);
    process.exit(1);
  }
})();
