// src/utils/auth.js

// Save session manually (if needed)
export function setSession(user) {
  localStorage.setItem("session", JSON.stringify(user))
}

// Attempt login by checking credentials in users.json
export async function login(username, password) {
  try {
    const res = await fetch("/users.json")
    if (!res.ok) throw new Error("Could not load users.json")

    const users = await res.json()
    const user = users.find(
      (u) => u.username === username && u.password === password
    )

    if (user) {
      setSession(user) // reuse helper
      return user
    } else {
      return null
    }
  } catch (err) {
    console.error("Login error:", err)
    return null
  }
}

// Get session from localStorage
export function getSession() {
  const data = localStorage.getItem("session")
  return data ? JSON.parse(data) : null
}

// Clear session
export function clearSession() {
  localStorage.removeItem("session")
}
