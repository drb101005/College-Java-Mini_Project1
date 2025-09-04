import { Routes, Route, Navigate } from 'react-router-dom'
import Login from './routes/Login.jsx'
import Home from './routes/Home.jsx'
import { getSession } from './utils/auth.js'


export default function App() {
const session = getSession()
return (
<Routes>
<Route path="/" element={<Login />} />
<Route path="/home" element={session ? <Home /> : <Navigate to="/" replace />} />
<Route path="*" element={<Navigate to={session ? '/home' : '/'} replace />} />
</Routes>
)
}