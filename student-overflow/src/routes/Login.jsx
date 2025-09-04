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
      // data is just an array, not { users: [...] }
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
    <div className="min-h-screen grid place-items-center p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-soft p-8">
        <div className="flex items-center gap-3 mb-6">
          <img src="/logo.svg" alt="logo" className="w-8 h-8" />
          <h1 className="text-2xl font-semibold">StudentOverflow</h1>
        </div>
        <p className="text-sm text-gray-600 mb-6">
          Login as <b>student1</b> or <b>mentor1</b> (password{' '}
          <b>123456</b>), stored in <code>public/users.json</code>.
        </p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Username</label>
            <input
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="student1 or mentor1"
              autoFocus
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Password</label>
            <input
              type="password"
              placeholder="123456"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              className="w-full rounded-xl border border-gray-300 px-3 py-2 outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
            />
          </div>
          {error && <div className="text-sm text-red-600">{error}</div>}
          <button
            disabled={loading}
            className="w-full rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-medium py-2 transition disabled:opacity-60"
          >
            {loading ? 'Checking…' : 'Sign in'}
          </button>
        </form>
      </div>
    </div>
  )
}
