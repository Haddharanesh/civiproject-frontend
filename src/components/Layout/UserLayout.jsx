import { Link, useLocation } from "react-router-dom"
import { useState, useEffect, useRef, useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import API from "../../services/api"

// Format relative time
const formatTime = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

// Notification Dropdown Component
const NotificationDropdown = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const res = await API.get(`/notifications/${user.id}`)
      setNotifications(res.data.reverse())
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isOpen && user?.id) {
      fetchNotifications()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user?.id])

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 transition-colors rounded-xl ${
          isOpen ? "bg-emerald-100 text-emerald-600" : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="px-4 py-3 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-emerald-500 mx-auto"></div>
                <p className="text-gray-500 text-sm mt-2">Loading...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-gray-500 text-sm">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {notifications.slice(0, 10).map((notification) => (
                  <div
                    key={notification.id}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer ${
                      !notification.read ? "bg-emerald-50/50" : ""
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        notification.read ? "bg-gray-100" : "bg-emerald-500"
                      }`}>
                        <span className={notification.read ? "text-gray-400" : "text-white text-sm"}>
                          {notification.read ? "📭" : "🔔"}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm ${notification.read ? "text-gray-600" : "text-gray-800 font-medium"}`}>
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
            <Link
              to="/notifications"
              onClick={() => setIsOpen(false)}
              className="block text-center text-sm text-emerald-600 font-medium hover:text-emerald-700 transition-colors"
            >
              View All Notifications →
            </Link>
          </div>
        </div>
      )}
    </div>
  )
}

// User Navbar with Green Theme
const UserNavbar = ({ onLogout }) => {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to="/dashboard" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:opacity-80 transition">
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-xs">CC</span>
            </div>
          </div>
          <span>CivicConnect</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link 
            to="/my-complaints" 
            className={`px-4 py-2 font-medium transition-colors rounded-xl ${
              location.pathname === "/my-complaints" 
                ? "text-emerald-600 bg-emerald-50" 
                : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
            }`}
          >
            My Complaints
          </Link>
          <Link 
            to="/public-reports" 
            className={`px-4 py-2 font-medium transition-colors rounded-xl ${
              location.pathname === "/public-reports" 
                ? "text-emerald-600 bg-emerald-50" 
                : "text-gray-600 hover:text-emerald-600 hover:bg-gray-50"
            }`}
          >
            Public Reports
          </Link>
          <Link 
            to="/report" 
            className="flex items-center gap-1 px-4 py-2 text-emerald-600 hover:text-emerald-700 font-medium transition-colors rounded-xl hover:bg-emerald-50"
          >
            <span>📝</span>
            Report Issue
          </Link>
          
          <NotificationDropdown user={user} />

          <Link
            to="/profile"
            className="flex items-center gap-2 ml-2 pl-3 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
          >
            <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "👤"}
            </div>
            <span className="text-gray-700 font-medium text-sm max-w-[100px] truncate">
              {user?.name}
            </span>
          </Link>

          <button
            onClick={onLogout}
            className="ml-2 px-4 py-2 text-gray-600 hover:text-red-600 font-medium transition-colors rounded-xl hover:bg-red-50"
          >
            Logout
          </button>
        </div>
      </div>
    </nav>
  )
}

const UserLayout = ({ children, onLogout }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100">
      <UserNavbar onLogout={onLogout} />
      <main className="mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}

export default UserLayout

