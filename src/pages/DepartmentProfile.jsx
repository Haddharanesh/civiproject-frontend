import { useContext } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"

function DepartmentProfile() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate("/department-login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-blue-600 rounded-2xl flex items-center justify-center text-4xl text-white shadow-lg">
              {user?.name?.charAt(0)?.toUpperCase() || "👤"}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{user?.name || "Department Admin"}</h1>
              <p className="text-gray-500 mt-1">{user?.email || "N/A"}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-blue-100 text-blue-700 border border-blue-200">
                  🏢 Department Admin
                </span>
                <span className="px-3 py-1 rounded-full text-sm font-semibold bg-purple-100 text-purple-700 border border-purple-200">
                  🏛️ {user?.department?.name || "Department"}
                </span>
              </div>
            </div>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-3 bg-red-500 hover:bg-red-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>🚪</span>
              Logout
            </button>
          </div>
        </div>

        {/* Department Info Cards */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">👤 Account Information</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">📧</span>
                <div>
                  <p className="text-sm text-gray-500">Email</p>
                  <p className="text-gray-800 font-medium">{user?.email || "N/A"}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-xl">🔑</span>
                <div>
                  <p className="text-sm text-gray-500">Role</p>
                  <p className="text-gray-800 font-medium">{user?.role || "DEPARTMENT_ADMIN"}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
            <h3 className="text-lg font-bold text-gray-800 mb-4">🏛️ Department Details</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-xl">✅</span>
                <div>
                  <p className="text-sm text-gray-500">Account Status</p>
                  <p className="text-green-600 font-medium">Active</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center text-xl">🆔</span>
                <div>
                  <p className="text-sm text-gray-500">User ID</p>
                  <p className="text-gray-800 font-medium">{user?.id || "N/A"}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4">
          <div 
            onClick={() => navigate("/department/review")}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl mb-3">📋</div>
            <h3 className="font-bold text-lg mb-1">Review Complaints</h3>
            <p className="text-blue-100 text-sm">Manage citizen complaints</p>
          </div>

          <div 
            onClick={() => navigate("/department/reports")}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl mb-3">📊</div>
            <h3 className="font-bold text-lg mb-1">Reports</h3>
            <p className="text-purple-100 text-sm">View department reports</p>
          </div>

          <div 
            onClick={() => navigate("/department/notifications")}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl mb-3">🔔</div>
            <h3 className="font-bold text-lg mb-1">Notifications</h3>
            <p className="text-indigo-100 text-sm">Stay updated on alerts</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DepartmentProfile
