
"use client"

import { Link, useNavigate } from "react-router-dom"
import { useCart } from "../context/CartContext"
import { useAuth } from "../context/AuthContext"
import { useState, useEffect } from "react"
import { buildApiUrl } from "../config/api"

const Header = ({ onToggleSidebar, sidebarOpen }) => {
  const { getUniqueItemCount } = useCart()
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState("")
  const [categories, setCategories] = useState([])
  const [showMobileMenu, setShowMobileMenu] = useState(false)
  const [showUserMenu, setShowUserMenu] = useState(false)

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await fetch(buildApiUrl("api/products/categories"))
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      const data = await response.json()
      if (Array.isArray(data)) {
        setCategories(data)
      } else {
        console.error("Categories data is not an array:", data)
        setCategories([])
      }
    } catch (error) {
      console.error("Error fetching categories:", error)
      setCategories([])
    }
  }

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`)
      setSearchQuery("")
    }
  }

  const handleLogout = () => {
    logout()
    setShowUserMenu(false)
    navigate("/")
  }

  return (
    <header className="glass-effect sticky top-0 z-50 border-b border-white/20 bg-white/95 backdrop-blur-sm">
      <div className="container mx-auto px-3 sm:px-4 lg:px-6 py-2 sm:py-3">
        <div className="flex items-center justify-between">
          {/* Left Section - Menu Button and Logo */}
          <div className="flex items-center space-x-2 sm:space-x-3">
            <button
              onClick={onToggleSidebar}
              className="p-1.5 sm:p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
              aria-label="Toggle sidebar"
            >
              <svg
                className="w-4 h-4 sm:w-5 sm:h-5 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/" className="flex items-center space-x-1 sm:space-x-2 group">
              <div className="w-7 h-7 sm:w-8 sm:h-8 lg:w-10 lg:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-lg sm:rounded-xl lg:rounded-2xl flex items-center justify-center shadow-lg group-hover:shadow-xl transform group-hover:scale-110 transition-all duration-300">
                <span className="text-white font-bold text-sm sm:text-base lg:text-lg">C</span>
              </div>
              {/* Hide text on small and medium screens, show only on large screens */}
              <h1 className="hidden lg:block text-xl lg:text-2xl xl:text-3xl font-bold gradient-text">
                Crunchywavez
              </h1>
            </Link>
          </div>

          {/* Center Section - Search Bar (hidden on mobile) */}
          <div className="hidden md:flex flex-1 max-w-md lg:max-w-lg mx-2 lg:mx-4 xl:mx-6">
            <form onSubmit={handleSearch} className="w-full relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for chips, snacks..."
                className="w-full px-3 lg:px-4 py-2 lg:py-2.5 pl-9 lg:pl-10 pr-3 lg:pr-4 rounded-lg lg:rounded-xl border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm lg:text-base"
              />
              <svg
                className="absolute left-2.5 lg:left-3 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 lg:w-4 lg:h-4 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </form>
          </div>

          {/* Right Section - Navigation and User Actions */}
          <div className="flex items-center space-x-2 sm:space-x-3 lg:space-x-4">
            {/* Quick Links - Hidden on mobile and tablet, shown on desktop */}
            <nav className="hidden xl:flex items-center space-x-4">
              <div className="relative group">
                <button className="text-slate-600 hover:text-indigo-600 font-medium transition-all duration-300 hover:scale-105 flex items-center space-x-2 px-4 py-2.5 rounded-lg hover:bg-indigo-50 text-base">
                  <span>Quick Links</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                <div className="absolute top-full left-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-50">
                  {Array.isArray(categories) &&
                    categories.slice(0, 5).map((category) => (
                      <Link
                        key={category.id}
                        to={`/category/${category.id}`}
                        className="flex items-center space-x-2 px-4 py-2.5 hover:bg-gray-50 transition-colors duration-200 first:rounded-t-xl last:rounded-b-xl text-sm"
                      >
                        <span className="text-lg">{category.icon}</span>
                        <span className="text-gray-700 hover:text-indigo-600">{category.name}</span>
                      </Link>
                    ))}
                </div>
              </div>
            </nav>

            {/* User Menu / Auth Buttons */}
            {isAuthenticated ? (
              <div
                className="relative group"
                onMouseEnter={() => setShowUserMenu(true)}
                onMouseLeave={() => setShowUserMenu(false)}
              >
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 text-gray-700 hover:text-indigo-600 transition-colors px-3 py-2.5 rounded-lg hover:bg-indigo-50"
                >
                  <div className="w-8 h-8 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center text-white text-sm font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || "U"}
                  </div>
                  <span className="hidden lg:inline font-medium text-base">{user?.name}</span>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                <div
                  className={`absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-50 transition-all duration-200 ${
                    showUserMenu
                      ? "opacity-100 visible"
                      : "opacity-0 invisible group-hover:opacity-100 group-hover:visible"
                  }`}
                >
                  <Link
                    to="/profile"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-2 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <span>👤</span>
                    <span>Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-2 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <span>📦</span>
                    <span>Orders</span>
                  </Link>
                  <Link
                    to="/wishlist"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center space-x-2 px-4 py-2.5 hover:bg-gray-50 transition-colors text-sm"
                  >
                    <span>❤️</span>
                    <span>Wishlist</span>
                  </Link>
                  <hr className="my-1" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 px-4 py-2.5 hover:bg-gray-50 transition-colors w-full text-left text-red-600 text-sm"
                  >
                    <span>🚪</span>
                    <span>Sign Out</span>
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex items-center bg-white/80 backdrop-blur-sm rounded-lg border border-gray-200 shadow-sm">
                <Link
                  to="/login"
                  className="text-gray-600 hover:text-indigo-600 font-medium transition-colors px-4 py-2.5 rounded-l-lg hover:bg-gray-50 text-sm"
                >
                  Sign In
                </Link>
                <div className="w-px h-5 bg-gray-300"></div>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-r-lg font-medium shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-sm"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Cart Button */}
            <Link
              to="/cart"
              className="relative bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 text-white px-4 py-2.5 rounded-lg font-semibold shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center space-x-2 pulse-glow"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-1.5 6M7 13l-1.5 6m0 0h9M17 13v6a2 2 0 01-2 2H9a2 2 0 01-2-2v-6"
                />
              </svg>
              <span className="hidden sm:inline text-sm">Cart</span>
              {getUniqueItemCount() > 0 && (
                <span className="absolute -top-2 -right-2 bg-gradient-to-r from-red-500 to-pink-500 text-white text-xs font-bold rounded-full w-5 h-5 sm:w-6 sm:h-6 flex items-center justify-center shadow-lg animate-bounce">
                  {getUniqueItemCount()}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar - Shown only on mobile devices */}
        <div className="md:hidden mt-2">
          <form onSubmit={handleSearch} className="w-full relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search for chips, snacks..."
              className="w-full px-3 py-2 pl-8 pr-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all duration-300 shadow-sm text-sm"
            />
            <svg
              className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </form>
        </div>
      </div>
    </header>
  )
}

export default Header