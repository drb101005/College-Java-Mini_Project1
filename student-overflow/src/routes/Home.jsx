// src/routes/Home.jsx
import { useEffect, useState } from "react"
import { useNavigate, Link } from "react-router-dom"
import { getSession, clearSession } from "../utils/auth.js"

export default function Home() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([])

  useEffect(() => {
    const session = getSession()
    if (!session) navigate("/")
    else {
      setQuestions([
        {
          id: 1,
          title: "How do I reverse a linked list in Java without recursion?",
          description:
            "I am implementing a singly linked list in Java. I want to reverse it iteratively...",
          votes: 12,
          answers: 3,
          views: 245,
          tags: ["java", "data-structures"],
          asked: "2 hours ago",
        },
        {
          id: 2,
          title:
            "React useEffect: dependency array confusion with async fetch",
          description:
            "When I call fetch inside useEffect, I get repeated calls or stale data...",
          votes: 7,
          answers: 1,
          views: 188,
          tags: ["react", "javascript", "hooks"],
          asked: "5 hours ago",
        },
      ])
    }
  }, [navigate])

  function handleLogout() {
    clearSession()
    navigate("/")
  }

  return (
    <div>
      {/* Header */}
      <header>
        <h1>StudentOverflow</h1>
        <div>
          <span style={{ marginRight: "1rem" }}>
            Welcome, {getSession()?.displayName} ({getSession()?.role})
          </span>
          <button onClick={handleLogout}>Logout</button>
        </div>
      </header>

      {/* Content */}
      <main className="container">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h2>Top Questions</h2>
          <Link to="/ask">
            <button>Ask Question</button>
          </Link>
        </div>

        <ul className="question-list">
          {questions.map((q) => (
            <li key={q.id} className="question-item">
              <div className="meta">
                {q.votes} votes • {q.answers} answers • {q.views} views
              </div>
              <Link to={`/questions/${q.id}`} className="question-title">
                {q.title}
              </Link>
              <p>{q.description}</p>
              <div className="meta">
                {q.tags.map((tag) => (
                  <span key={tag} className="tag">
                    {tag}
                  </span>
                ))}
                <span style={{ float: "right" }}>asked {q.asked}</span>
              </div>
            </li>
          ))}
        </ul>
      </main>
    </div>
  )
}
