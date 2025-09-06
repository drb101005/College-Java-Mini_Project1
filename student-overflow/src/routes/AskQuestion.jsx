// src/routes/AskQuestion.jsx
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { getSession } from "../utils/auth.js"

export default function AskQuestion() {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [tags, setTags] = useState("")
  const navigate = useNavigate()

  async function handleSubmit(e) {
    e.preventDefault()
    const session = getSession()
    if (!session) return navigate("/")

    await fetch("http://localhost:5000/questions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title,
        description,
        tags: tags.split(",").map(t => t.trim()),
        author: session.username
      })
    })

    navigate("/home")
  }

  return (
    <div className="container">
      <h2>Ask a Question</h2>
      <form onSubmit={handleSubmit} className="form">
        <label>Title</label>
        <input value={title} onChange={(e) => setTitle(e.target.value)} required />

        <label>Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <label>Tags (comma separated)</label>
        <input value={tags} onChange={(e) => setTags(e.target.value)} />

        <button type="submit">Post Question</button>
      </form>
    </div>
  )
}
