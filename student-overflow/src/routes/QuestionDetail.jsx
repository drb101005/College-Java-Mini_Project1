// src/routes/QuestionDetail.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function QuestionDetail() {
  const { id } = useParams();
  const [question, setQuestion] = useState(null);
  const [newAnswer, setNewAnswer] = useState("");

  useEffect(() => {
    fetch(`http://localhost:5000/questions/${id}`)
      .then(res => res.json())
      .then(data => {
        setQuestion(data);
      })
      .catch(err => console.error("Failed to load question:", err));
  }, [id]);

  async function handleAddAnswer() {
    if (!newAnswer.trim()) return;
    const res = await fetch(`http://localhost:5000/questions/${id}/answers`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: newAnswer, author: "Guest" }),
    });
    const added = await res.json();
    setQuestion(prev => ({
      ...prev,
      answers: [{ ...added, votes: 0, createdAt: new Date().toISOString() }, ...prev.answers],
    }));
    setNewAnswer("");
  }

  if (!question) return <p>Loading...</p>;

  return (
    <div style={{ padding: "1rem" }}>
      <h1>{question.title}</h1>
      <p>{question.description}</p>
      <div style={{ marginBottom: "1rem" }}>
        {question.tags.map(tag => (
          <span
            key={tag}
            style={{
              background: "#eef",
              padding: "2px 6px",
              borderRadius: "4px",
              marginRight: "0.5rem",
              fontSize: "0.8rem",
            }}
          >
            {tag}
          </span>
        ))}
      </div>

      <h2>Answers</h2>
      <ul>
        {question.answers.map(ans => (
          <li key={ans.id} style={{ marginBottom: "0.5rem" }}>
            <p>{ans.text}</p>
            <small>— {ans.author} ({new Date(ans.createdAt).toLocaleString()})</small>
          </li>
        ))}
      </ul>

      <h3>Add your Answer</h3>
      <textarea
        value={newAnswer}
        onChange={(e) => setNewAnswer(e.target.value)}
        rows={3}
        style={{ width: "100%", marginBottom: "0.5rem" }}
      />
      <br />
      <button onClick={handleAddAnswer}>Submit Answer</button>
    </div>
  );
}
