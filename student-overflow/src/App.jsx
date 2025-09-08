//Central Routes
// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Login from "./routes/Login.jsx";
import Home from "./routes/Home.jsx";
import AskQuestion from "./routes/AskQuestion.jsx";
import QuestionDetail from "./routes/QuestionDetail.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/home" element={<Home />} />
      <Route path="/ask-question" element={<AskQuestion />} />
      <Route path="/question/:id" element={<QuestionDetail />} />
    </Routes>
  );
}
