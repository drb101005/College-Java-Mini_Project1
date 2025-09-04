import { NavLink } from "react-router-dom"

export default function Sidebar() {
  const links = [
    { name: "Home", to: "#" },
    { name: "Questions", to: "#" },
    { name: "Tags", to: "#" },
    { name: "Users", to: "#" },
  ]

  return (
    <aside className="hidden md:block w-48 flex-shrink-0 border-r border-gray-200 py-6 px-3 text-sm">
      <nav className="space-y-1">
        {links.map(link => (
          <NavLink
            key={link.name}
            to={link.to}
            className="block px-3 py-2 rounded-lg hover:bg-gray-100 text-gray-700"
          >
            {link.name}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
