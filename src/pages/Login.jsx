import { useState, useContext } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../services/api"
import { AuthContext } from "../contexts/AuthContext"

function Login() {
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

  // SUPER ADMIN
  if (user.role === "SUPER_ADMIN") {
    login(user, token)
    navigate("/superadmin/dashboard")
    return
  }

  // DEPARTMENT ADMIN
  if (user.role === "DEPARTMENT_ADMIN") {
    login(user, token)
    navigate("/department/dashboard")
    return
  }

  // REGULAR USER
  login(user, token)
  navigate("/dashboard")

// eslint-disable-next-line no-unused-vars
} catch (err) {
  setError("Invalid email or password")
} finally {
  setLoading(false)
}
}


  return (
    <div className="min-h-screen flex bg-gradient-to-br from-emerald-50 via-white to-emerald-100">

      {/* LEFT — Image / Branding */}
      <div className="hidden lg:flex w-1/2 relative items-center justify-center overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d?q=80&w=1600&auto=format&fit=crop"
          alt="City"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-emerald-900/60 backdrop-blur-sm"></div>

        <div className="relative z-10 text-white px-12">
          <div className="w-16 h-16 bg-white/20 backdrop-blur-lg rounded-2xl flex items-center justify-center text-3xl mb-6">
            🏙️
          </div>
          <h1 className="text-4xl font-bold mb-4 leading-tight">
            Welcome Back to <br /> <span className="text-emerald-300">CivicConnect</span>
          </h1>
          <p className="text-lg text-emerald-100 max-w-md">
            Track issues, monitor progress, and help improve your city.
            Your voice makes a difference.
          </p>
          
          {/* Feature highlights */}
          <div className="mt-8 space-y-3">
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500/30 rounded-lg flex items-center justify-center">✓</span>
              <span className="text-emerald-100">Report civic issues with photos</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500/30 rounded-lg flex items-center justify-center">✓</span>
              <span className="text-emerald-100">Track resolution progress</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-emerald-500/30 rounded-lg flex items-center justify-center">✓</span>
              <span className="text-emerald-100">Upvote community issues</span>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT — Login Form */}
      <div className="flex flex-1 items-center justify-center px-6 py-12">
        <div className="bg-white/90 backdrop-blur-xl border border-white/40 p-8 rounded-3xl shadow-2xl w-full max-w-md">
          
          {/* Mobile Header */}
          <div className="lg:hidden text-center mb-6">
            <div className="w-14 h-14 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3 shadow-lg">
              🏙️
            </div>
            <h1 className="text-2xl font-bold text-gray-800">CivicConnect</h1>
          </div>

          <div className="text-center mb-6">
            <h2 className="text-3xl font-bold text-gray-800">Welcome Back</h2>
            <p className="text-gray-500 mt-1">Login to continue reporting issues</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 text-sm p-3 rounded-xl mb-4 text-center flex items-center justify-center gap-2">
              <span>⚠️</span>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">📧</span>
              <input
                type="email"
                placeholder="Email Address"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
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
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent bg-gray-50 focus:bg-white transition-all"
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
                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-emerald-500 to-emerald-600 text-white hover:from-emerald-600 hover:to-emerald-700 hover:shadow-xl"
              }`}
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Logging in...
                </span>
              ) : (
                "Login"
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            Don't have an account?{" "}
            <Link to="/signup" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              Sign up
            </Link>
          </p>
          <p className="text-center text-sm text-gray-500 mt-3">
              Are you a department officer?{" "}
              <Link
                to="/department-login"
                className="text-blue-600 font-semibold hover:text-blue-700 transition-colors"
              >
                Department Login
              </Link>
            </p>
              <p className="text-center text-sm text-gray-500 mt-3">
                System Administrator?{" "}
                <Link
                  to="/superadmin-login"
                  className="text-yellow-600 font-semibold hover:text-yellow-700 transition-colors"
                >
                  Super Admin Access 👑
                </Link>
              </p>

        </div>
      </div>
    </div>
  )
}

export default Login

