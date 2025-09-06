// src/routes/Login.jsx
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { getSession, setSession } from "../utils/auth.js"

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  useEffect(() => {
    if (getSession()) navigate("/home")
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError("")
    setLoading(true)
    try {
      const res = await fetch("/users.json")
      const data = await res.json()
      const user = data.find(
        (u) => u.username === username && u.password === password
      )
      if (!user) {
        setError("Invalid credentials")
        return
      }
      setSession(user)
      navigate("/home")
    } catch (err) {
      setError("Failed to load users.json")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container" style={{ maxWidth: "400px", marginTop: "80px" }}>
      <div className="question-item">
        <h2 style={{ textAlign: "center", marginBottom: "16px" }}>
          StudentOverflow Login
        </h2>
        <p style={{ fontSize: "0.9rem", marginBottom: "12px" }}>
          Use <b>student1</b> / <b>mentor1</b> with password <b>123456</b>.
        </p>
        <form onSubmit={handleSubmit}>
          <div>
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter username"
              autoFocus
              required
            />
          </div>
          <div>
            <label>Password</label>
            <input
              type="password"
              value={password}
              placeholder="Enter password"
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {error && (
            <div style={{ color: "red", fontSize: "0.9rem" }}>{error}</div>
          )}
          <button disabled={loading}>
            {loading ? "Checking…" : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  )
}
