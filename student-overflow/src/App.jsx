// src/App.jsx
import { Routes, Route } from "react-router-dom"
import Login from "./routes/Login"
import Signup from "./pages/Signup"
import Home from "./routes/Home"
import "./styles.css";


function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/home" element={<Home />} />
    </Routes>
  )
}

export default App
