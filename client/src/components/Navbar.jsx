import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()
  const user = JSON.parse(localStorage.getItem('user'))

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
    setIsOpen(false)
  }

  const isActive = (path) => location.pathname === path

  const navLinks = [
    { label: 'Home', path: '/' },
    { label: 'Tasks', path: '/tasks' }
  ]

  return (
    <nav className="bg-slate-800 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <button
              onClick={() => navigate('/')}
              className="text-2xl font-bold text-blue-400 hover:text-blue-300 transition-colors"
            >
              TaskFlow
            </button>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => navigate(link.path)}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-700 hover:text-white'
                  }`}
              >
                {link.label}
              </button>
            ))}
          </div>

          {/* User Info & Logout - Desktop */}
          <div className="hidden md:flex items-center space-x-4">
            {user && (
              <span className="text-sm text-gray-300">
                Welcome, <span className="font-semibold text-blue-400">{user.name}</span>
              </span>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors"
            >
              Logout
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-4">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-slate-700 transition-colors"
            >
              <svg
                className={`h-6 w-6 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                stroke="currentColor"
                fill="none"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isOpen && (
        <div className="md:hidden bg-slate-700 border-t border-slate-600">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navLinks.map((link) => (
              <button
                key={link.path}
                onClick={() => {
                  navigate(link.path)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 rounded-md text-base font-medium transition-colors ${isActive(link.path)
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:bg-slate-600 hover:text-white'
                  }`}
              >
                {link.label}
              </button>
            ))}
            {user && (
              <div className="px-3 py-2 text-sm text-gray-300 border-t border-slate-600 mt-2">
                Welcome, <span className="font-semibold text-blue-400">{user.name}</span>
              </div>
            )}
            <button
              onClick={handleLogout}
              className="w-full text-left px-3 py-2 rounded-md bg-red-600 text-white font-medium hover:bg-red-700 transition-colors mt-2"
            >
              Logout
            </button>
          </div>
        </div>
      )}
    </nav>
  )
}
