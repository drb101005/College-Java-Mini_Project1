// src/routes/AskQuestion.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./AskQuestion.css";

export default function AskQuestion() {
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [tags, setTags] = useState("");
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    console.log("New Question:", { title, desc, tags: tags.split(",") });
    // TODO: send to backend
    navigate("/home");
  }

  return (
    <div className="ask-container">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <label>Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <label>Description</label>
        <textarea
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        ></textarea>

        <label>Tags (comma separated)</label>
        <input
          type="text"
          value={tags}
          onChange={(e) => setTags(e.target.value)}
        />

        <button type="submit">Post Question</button>
      </form>
    </div>
  );
}
