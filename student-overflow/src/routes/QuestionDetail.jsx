// src/routes/QuestionDetail.jsx
import { useParams } from "react-router-dom"
import { useState } from "react"
import { getSession } from "../utils/auth.js"

export default function QuestionDetail() {
  const { id } = useParams()
  const [answers, setAnswers] = useState([
    {
      id: 1,
      text: "You can reverse a linked list iteratively by keeping track of previous, current, and next pointers.",
      author: "mentor1",
    },
  ])
  const [newAnswer, setNewAnswer] = useState("")

  function handleAddAnswer(e) {
    e.preventDefault()
    if (!newAnswer.trim()) return

    const answer = {
      id: Date.now(),
      text: newAnswer,
      author: getSession()?.username || "anonymous",
    }

    setAnswers([...answers, answer])
    setNewAnswer("")
  }

  return (
    <div>
      <header>
        <h1>Question Detail</h1>
      </header>
      <main className="container">
        <div className="question-detail">
          <h2>How do I reverse a linked list in Java without recursion?</h2>
          <p>
            I am implementing a singly linked list in Java. I want to reverse it
            iteratively...
          </p>
          <div className="meta">Tags: <span className="tag">java</span> <span className="tag">data-structures</span></div>
        </div>

        <h3>Answers</h3>
        {answers.map((ans) => (
          <div key={ans.id} className="answer">
            <p>{ans.text}</p>
            <small>— answered by {ans.author}</small>
          </div>
        ))}

        <form onSubmit={handleAddAnswer}>
          <label>Your Answer</label>
          <textarea
            rows="4"
            value={newAnswer}
            onChange={(e) => setNewAnswer(e.target.value)}
            placeholder="Write your answer here..."
          />
          <button type="submit">Post Answer</button>
        </form>
      </main>
    </div>
  )
}
