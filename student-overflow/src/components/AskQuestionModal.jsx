// src/routes/AskQuestion.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getSession } from "../utils/auth.js"

export default function AskQuestion() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const navigate = useNavigate()

  function handleSubmit(e) {
    e.preventDefault()
    const session = getSession()
    if (!session) return navigate("/")

    // For now: just log question (later -> push to backend or state mgmt)
    const newQuestion = {
      id: Date.now(),
      title,
      description,
      tags: tags.split(",").map(t => t.trim()),
      votes: 0,
      answers: [],
      views: 0,
      asked: "just now",
      author: session.username,
    }
    console.log("New Question:", newQuestion)

    navigate("/home")
  }

  return (
    <div className="container">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Title</label><br />
          <input value={title} onChange={e => setTitle(e.target.value)} required />
        </div>
        <div>
          <label>Description</label><br />
          <textarea value={description} onChange={e => setDescription(e.target.value)} required />
        </div>
        <div>
          <label>Tags (comma separated)</label><br />
          <input value={tags} onChange={e => setTags(e.target.value)} />
        </div>
        <button type="submit">Post Question</button>
      </form>
    </div>
  )
}
