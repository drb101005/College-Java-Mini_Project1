import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { getSession, setSession } from '../utils/auth.js'

export default function Login() {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  useEffect(() => {
    if (getSession()) navigate('/home')
  }, [navigate])

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await fetch('/users.json')
      const data = await res.json()
      const user = data.find(
        (u) => u.username === username && u.password === password
      )
      if (!user) {
        setError('Invalid credentials')
        return
      }
      setSession({
        username: user.username,
        role: user.role,
        displayName: user.displayName,
      })
      navigate('/home')
    } catch (err) {
      setError('Failed to load users.json')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-wrapper">
      <div className="login-box">
        <div className="logo-section">
          <img src="/logo.svg" alt="logo" className="logo" />
          <h1>StudentOverflow</h1>
        </div>

        <p>
          Login as <b>student1</b> or <b>mentor1</b> (password <b>123456</b>),
          stored in <code>public/users.json</code>.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="student1 or mentor1"
            autoFocus
          />

          <label>Password</label>
          <input
            type="password"
            placeholder="123456"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />

          {error && <div className="error-msg">{error}</div>}

          <button disabled={loading}>
            {loading ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
