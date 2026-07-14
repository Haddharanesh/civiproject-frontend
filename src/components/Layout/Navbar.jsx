import { Link, useLocation } from "react-router-dom"
import { useContext } from "react"
import { AuthContext } from "../../contexts/AuthContext"
import NotificationDropdown from "../UI/NotificationDropdown"

const Navbar = ({ showMinimalNav = false }) => {
  const { user } = useContext(AuthContext)
  const location = useLocation()

  // Check if we should show minimal nav (login pages)
  const isLoginPage = location.pathname === "/login" || location.pathname === "/department-login"
  const shouldShowMinimal = showMinimalNav || isLoginPage

  return (
    <nav className="sticky top-0 z-50 w-full bg-white/90 backdrop-blur-lg border-b border-gray-100 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-3 flex justify-between items-center">

        {/* Logo */}
        <Link
          to={user ? "/dashboard" : "/"}
          className="flex items-center gap-2 text-xl font-bold text-gray-800 hover:opacity-80 transition"
        >
          <div className="w-9 h-9 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-md">
            <div className="w-6 h-6 bg-white rounded-full flex items-center justify-center">
              <span className="text-emerald-600 font-bold text-xs">CC</span>
            </div>
          </div>

          <span>CivicConnect</span>
        </Link>

        {/* Right Side Links */}
        <div className="flex items-center gap-2">

          {/* Show empty nav for login pages */}
          {shouldShowMinimal ? (
            <div></div>
          ) : (
            <>
              {!user && (
                <>
                  <Link 
                    to="/login" 
                    className="px-4 py-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors rounded-xl hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-5 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200"
                  >
                    Sign Up
                  </Link>
                </>
              )}

              {user && (
                <>
                  <Link 
                    to="/my-complaints" 
                    className="px-4 py-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors rounded-xl hover:bg-gray-50"
                  >
                    My Complaints
                  </Link>
                  <Link 
                    to="/public-reports" 
                    className="px-4 py-2 text-gray-600 hover:text-emerald-600 font-medium transition-colors rounded-xl hover:bg-gray-50"
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
                  
                  {/* Notifications Dropdown - User Portal (Emerald Theme) */}
                  <NotificationDropdown 
                    user={user} 
                    theme="emerald"
                    viewAllLink="/notifications"
                    notificationsApi="/notifications/my"
                  />

                  {/* User Avatar */}
                  <Link
                    to="/profile"
                    className="flex items-center gap-2 ml-2 pl-3 pr-3 py-1.5 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors border border-gray-100"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-lg flex items-center justify-center text-white text-sm font-bold">
                      {user.name?.charAt(0)?.toUpperCase() || "👤"}
                    </div>
                    <span className="text-gray-700 font-medium text-sm max-w-[100px] truncate">
                      {user.name}
                    </span>
                  </Link>
                </>
              )}
            </>
          )}

        </div>
      </div>
    </nav>
  )
}

export default Navbar

