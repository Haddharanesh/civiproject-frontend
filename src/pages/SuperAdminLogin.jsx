import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"
import { AuthContext } from "../contexts/AuthContext"

function SuperAdminLogin() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const { login } = useContext(AuthContext)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      const res = await API.post("/auth/login", { email, password })

      const user = res.data.user
      const token = res.data.token

      // Check if user is SUPER_ADMIN
      if (user.role !== "SUPER_ADMIN") {
        setError("Unauthorized access")
        return
      }

      // If role is SUPER_ADMIN, login and navigate
      login(user, token)
      navigate("/superadmin/dashboard")

    // eslint-disable-next-line no-unused-vars
    } catch (err) {
      setError("Invalid email or password")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">

      {/* LEFT — Branding */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1600&auto=format&fit=crop"
          alt="Admin"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gray-900/70 backdrop-blur-sm"></div>

        <div className="relative z-10 text-white px-12">
          <div className="w-20 h-20 bg-amber-500/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-4xl mb-6 border border-amber-500/30">
            👑
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Super Admin <br /> <span className="text-amber-400">Control Panel</span>
          </h1>
          <p className="text-lg text-gray-300 max-w-md">
            Restricted system control panel. Manage users, departments, and monitor all civic complaints.
          </p>
          
          {/* Feature highlights */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-amber-500/30 rounded-lg flex items-center justify-center">✓</span>
              <span className="text-gray-300">Manage all users and roles</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-amber-500/30 rounded-lg flex items-center justify-center">✓</span>
              <span className="text-gray-300">Create and delete departments</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-amber-500/30 rounded-lg flex items-center justify-center">✓</span>
              <span className="text-gray-300">View and manage all complaints</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Login Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="bg-gray-800/90 backdrop-blur-xl border border-gray-700/50 p-8 rounded-3xl shadow-2xl w-full max-w-md">
          
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg border border-amber-500/30">
              👑
            </div>
            <h1 className="text-2xl font-bold text-white">Super Admin</h1>
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-3 shadow-lg border border-amber-500/30">
              👑
            </div>
            <h2 className="text-3xl font-bold text-white">Super Admin Access</h2>
            <p className="text-gray-400 mt-1">Restricted System Control Panel</p>
          </div>

          {error && (
            <div className="bg-red-900/50 border border-red-500/50 text-red-400 text-sm p-3 rounded-xl mb-4 text-center flex items-center justify-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
              <input
                type="email"
                placeholder="Admin Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-700/50 text-white placeholder-gray-400 transition-all"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">🔒</span>
              <input
                type="password"
                placeholder="Password"
                className="w-full pl-10 pr-4 py-3 border border-gray-600 rounded-xl focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent bg-gray-700/50 text-white placeholder-gray-400 transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3 rounded-xl text-lg font-bold transition-all duration-200 shadow-lg ${
                loading
                  ? "bg-gray-600 text-gray-400 cursor-not-allowed"
                  : "bg-gradient-to-r from-amber-500 to-amber-600 text-gray-900 hover:from-amber-400 hover:to-amber-500 hover:shadow-xl"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Authenticating...
                </span>
              ) : (
                "Access Control Panel"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Not an admin?{" "}
            <Link to="/login" className="text-amber-400 font-semibold hover:text-amber-300 transition-colors">
              Regular Login
            </Link>
          </p>

        </div>
      </div>
    </div>
  )
}

export default SuperAdminLogin

