// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import Login from "./routes/Login.jsx"
import Home from "./routes/Home.jsx"
import AskQuestion from "./routes/AskQuestion.jsx"
import QuestionDetail from "./routes/QuestionDetail.jsx"

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/ask" element={<AskQuestion />} />
        <Route path="/questions/:id" element={<QuestionDetail />} />
      </Routes>
    </Router>
  )
}
