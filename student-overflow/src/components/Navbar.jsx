import { useNavigate } from 'react-router-dom'
import { clearSession, getSession } from "../utils/auth.js"


export default function Navbar({ query, setQuery }) {
  const navigate = useNavigate()
  const session = getSession()

  function logout() {
    clearSession()
    navigate('/')
  }

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-16 flex items-center gap-4">
        {/* Logo + Title */}
        <div className="flex items-center gap-2">
          <img src="/logo.svg" className="w-7 h-7" alt="logo" />
          <span className="font-semibold">StudentOverflow</span>
        </div>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-4 text-sm text-gray-600">
          <a className="hover:text-gray-900" href="#">Home</a>
          <a className="hover:text-gray-900" href="#">Questions</a>
          <a className="hover:text-gray-900" href="#">Tags</a>
          <a className="hover:text-gray-900" href="#">Users</a>
        </nav>

        <div className="flex-1" />

        {/* Search bar */}
        <div className="relative w-full max-w-xl">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="Search questions…"
            className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2 outline-none focus:ring-4 focus:ring-brand-100 focus:border-brand-400"
          />
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">⌕</div>
        </div>

        <div className="flex-1" />

        {/* User info + Logout */}
        <div className="flex items-center gap-3">
          <div className="text-sm text-gray-700">
            {session?.displayName}{' '}
            <span className="ml-1 text-xs text-white bg-brand-600 px-2 py-0.5 rounded-full">
              {session?.role === 'mentor' ? 'Mentor' : 'Student'}
            </span>
          </div>
          <button
            onClick={logout}
            className="text-sm rounded-xl border px-3 py-2 hover:bg-gray-50"
          >
            Log out
          </button>
        </div>
      </div>
    </header>
  )
}
