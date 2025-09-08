//Shows questions
//ask question box
//each question with its seprate page
//logout button
// src/routes/Home.jsx
import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getSession, clearSession } from "../utils/auth.js";

export default function Home() {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);

  useEffect(() => {
    const session = getSession();
    if (!session) {
      navigate("/");
      return;
    }

    fetch("http://localhost:5000/questions")
      .then(res => {
        if (!res.ok) throw new Error("Network response not ok");
        return res.json();
      })
      .then(data => {
        console.log("Fetched questions :", data);
        setQuestions(data);
      })
      .catch(err => {
        console.error("Failed to load questions:", err);
        setQuestions([]); // avoid null
      });
  }, [navigate]);

  function handleLogout() {
    clearSession();
    navigate("/");
  }

  return (
    <div>
      <header>
        <h1>StudentOverflow</h1>
        <div>
          <span style={{ marginRight: "1rem" }}>
            Welcome, {getSession()?.displayName} ({getSession()?.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
          <button onClick={() => navigate("/ask-question")}>Ask Question</button>
        </div>
      </header>

      <main className="container">
        <h2 style={{ marginBottom: "1rem" }}>Top Questions</h2>
        <ul className="question-list">
          {questions.map((q) => {
            // normalize tags to an array (works whether backend sends string or array)
            const tagsArray = Array.isArray(q.tags)
              ? q.tags
              : (q.tags ? String(q.tags).split(",").filter(t => t !== "") : []);

            return (
              <li key={q.id} className="question-item">
                <div className="meta">
                  {q.votes || 0} votes • {q.answersCount || 0} answers • {q.views || 0} views
                </div>
                <Link to={`/question/${q.id}`} className="question-title">
                  {q.title}
                </Link>
                <p>{q.description}</p>
                <div className="meta">
                  {tagsArray.map((tag) => (
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
                  <span style={{ float: "right" }}>asked {q.asked || "just now"}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </main>
    </div>
  );
}
