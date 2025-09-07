import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSession, setSession } from "../utils/auth.js";
import "./Login.css"; // custom CSS

export default function Login() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (getSession()) navigate("/home");
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/users.json");
      const data = await res.json();
      const user = data.find(
        (u) => u.username === username && u.password === password
      );
      if (!user) {
        setError("Invalid credentials ❌");
        return;
      }
      setSession({
        username: user.username,
        role: user.role,
        displayName: user.displayName,
      });
      navigate("/home");
    } catch (err) {
      setError("⚠️ Failed to load users.json");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">Student Overflow</h1>
        <p className="login-subtitle">
          Login as <b>student-1</b> or <b>mentor-1</b><br />
          Password: <b>123456</b>
        </p>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            className="login-input"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Username"
            autoFocus
          />
          <input
            type="password"
            className="login-input"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
          />
          {error && <div className="login-error">{error}</div>}
          <button disabled={loading} className="login-button">
            {loading ? "Checking…" : "Sign In"}
          </button>
        </form>
      </div>
    </div>
  );
}
