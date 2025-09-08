//Global access
//Records of the logs
// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from "react";
import { apiFetch } from "../api/api";

// Create context
export const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      apiFetch("/me")
        .then((u) => setUser(u))
        .catch(() => {
          localStorage.removeItem("token");
        });
    }
  }, []);

  async function login(username, password) {
    const res = await fetch("http://localhost:4000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
    });
    if (!res.ok) throw await res.json();
    const { token, user } = await res.json();
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  }

  async function signup(username, password, role = "student", displayName) {
    const res = await fetch("http://localhost:4000/api/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password, role, displayName }),
    });
    if (!res.ok) throw await res.json();
    const { token, user } = await res.json();
    localStorage.setItem("token", token);
    setUser(user);
    return user;
  }

  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
