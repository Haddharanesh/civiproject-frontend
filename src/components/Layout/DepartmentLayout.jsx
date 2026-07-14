import { Link, useLocation, useNavigate } from "react-router-dom"
import { useContext, useState, useRef, useEffect } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import NotificationDropdown from "../UI/NotificationDropdown"

// Department Navbar with Blue Theme
const DepartmentNavbar = () => {
  const { user, logout } = useContext(AuthContext)
  const location = useLocation()
  const navigate = useNavigate?.() || (() => {})
  const [showProfileDropdown, setShowProfileDropdown] = useState(false)
  const profileRef = useRef(null)

  // Close profile dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileDropdown(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  // Logo redirect based on user role
  const logoHref = !user ? "/department-login" : "/department/dashboard"

  // Show minimal navbar for login page
  if (!user) {
    return (
      <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-blue-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
          <Link to="/" className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:opacity-80 transition">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold text-xs">CC</span>
              </div>
            </div>
            <span className="text-blue-600">CivicConnect</span>
          </Link>
        </div>
      </nav>
    )
  }

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-blue-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">
        <Link to={logoHref} className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:opacity-80 transition">
          <div className="w-9 h-9 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-blue-600 font-bold text-xs">CC</span>
            </div>
          </div>
          <span className="text-blue-600">CivicConnect</span>
        </Link>

        <div className="flex items-center gap-2">
          <Link 
            to="/department/review" 
            className={`px-4 py-2 font-medium transition-colors rounded-xl ${
              location.pathname === "/department/review" 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Review Complaints
          </Link>
          <Link 
            to="/department/reports" 
            className={`px-4 py-2 font-medium transition-colors rounded-xl ${
              location.pathname === "/department/reports" 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-600 hover:text-blue-600 hover:bg-gray-50"
            }`}
          >
            Reports
          </Link>
          
          {/* Notifications Dropdown - Department Portal (Blue Theme) */}
          <NotificationDropdown 
            user={user}
            theme="blue"
            viewAllLink="/department/notifications"
            notificationsApi="/notifications/department"
          />

          {/* Profile Dropdown */}
          <div className="relative" ref={profileRef}>
            <button
              onClick={() => setShowProfileDropdown(!showProfileDropdown)}
              className={`flex items-center gap-2 ml-2 pl-3 pr-3 py-1.5 rounded-xl transition-colors border border-gray-100 ${
                showProfileDropdown ? "bg-blue-50 border-blue-200" : "bg-gray-50 hover:bg-gray-100"
              }`}
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                {user?.name?.charAt(0)?.toUpperCase() || "👤"}
              </div>
              <span className="text-gray-700 font-medium text-sm max-w-[100px] truncate">
                {user?.name}
              </span>
              <span className={`text-gray-400 transition-transform ${showProfileDropdown ? "rotate-180" : ""}`}>
                ▼
              </span>
            </button>

            {showProfileDropdown && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
                <Link
                  to="/department/profile"
                  onClick={() => setShowProfileDropdown(false)}
                  className="flex items-center gap-2 px-4 py-3 text-gray-600 hover:bg-gray-50 transition-colors"
                >
                  <span>👤</span>
                  View Profile
                </Link>
                <button
                  onClick={() => {
                    logout()
                    navigate("/department-login")
                  }}
                  className="w-full flex items-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 transition-colors border-t border-gray-100"
                >
                  <span>🚪</span>
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  )
}

const DepartmentLayout = ({ children }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100">
      <DepartmentNavbar />
      <main className="mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  )
}

export default DepartmentLayout
