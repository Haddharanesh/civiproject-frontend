import { useContext, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../contexts/AuthContext"
import API from "../services/api"
import { IMAGE_BASE_URL } from "../config"

// Utility functions for styling
const getStatusBadge = (status) => {
  switch (status) {
    case "RESOLVED": return "bg-green-100 text-green-700 border-green-200";
    case "IN_PROGRESS": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default: return "bg-red-100 text-red-700 border-red-200";
  }
};

const getCategoryIcon = (category) => {
  switch (category?.toLowerCase()) {
    case "road": return "🛣️";
    case "waste": return "🗑️";
    case "electricity": return "⚡";
    case "water": return "💧";
    default: return "📍";
  }
};

const formatDate = (dateString) => {
  if (!dateString) return "";
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric"
  });
};

// Summary Card Component
const SummaryCard = ({ icon, label, count, color, bgColor }) => (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 hover:shadow-xl transition-all duration-300">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-gray-500 text-sm font-medium">{label}</p>
        <p className={`text-4xl font-bold ${color} mt-1`}>{count}</p>
      </div>
      <div className={`${bgColor} p-4 rounded-2xl text-3xl`}>
        {icon}
      </div>
    </div>
  </div>
);

// Complaint Card Component
const ComplaintCard = ({ complaint, onViewDetails }) => (
  <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
    {/* Image Preview */}
    {complaint.imageUrl && (
      <div className="relative h-32 overflow-hidden">
        <img
          src={`${IMAGE_BASE_URL}${complaint.imageUrl}`}
          alt={complaint.title || "Issue"}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
      </div>
    )}

    <div className="p-4">
      <div className="flex justify-between items-start mb-2">
        <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded-full font-semibold">
          {getCategoryIcon(complaint.category)} {complaint.category}
        </span>
        <span className={`${getStatusBadge(complaint.status)} px-2 py-1 rounded-full text-xs font-semibold border`}>
          {complaint.status?.replace("_", " ")}
        </span>
      </div>

      <h3 className="text-md font-bold text-gray-800 mb-1 group-hover:text-emerald-600 transition-colors line-clamp-1">
        {complaint.title || "Untitled Issue"}
      </h3>

      <p className="text-gray-600 text-sm mb-3 line-clamp-2">
        {complaint.description}
      </p>

      <div className="flex items-center justify-between">
        <span className="text-gray-400 text-xs">{formatDate(complaint.createdAt)}</span>
        <button
          onClick={() => onViewDetails(complaint.id)}
          className="text-emerald-600 hover:text-emerald-700 font-semibold text-xs flex items-center gap-1 transition-colors"
        >
          View →
        </button>
      </div>
    </div>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
  </div>
);

function Profile() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)

  // 🚨 If no user, send to login
  useEffect(() => {
    if (!user) {
      navigate("/login")
    }
  }, [user, navigate])

  // Fetch user's complaints
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        const res = await API.get("/complaints/my")
        setComplaints(res.data)
      } catch (err) {
        console.error("Failed to fetch complaints", err)
      } finally {
        setLoading(false)
      }
    }

    if (user) {
      fetchComplaints()
    }
  }, [user])

  if (!user) return null

  // Compute stats
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "NEW").length,
    inProgress: complaints.filter(c => c.status === "IN_PROGRESS").length,
    resolved: complaints.filter(c => c.status === "RESOLVED").length
  }

  const handleViewDetails = (id) => {
    navigate(`/complaint/${id}`)
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">

        {/* Profile Header Card */}
        <div className="bg-white rounded-3xl shadow-xl p-8 mb-8 border border-gray-100">
          <div className="flex flex-col md:flex-row md:items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 bg-gradient-to-br from-emerald-400 to-emerald-600 rounded-2xl flex items-center justify-center text-4xl text-white shadow-lg">
              {user.name?.charAt(0)?.toUpperCase() || "👤"}
            </div>

            {/* User Info */}
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-800">{user.name}</h1>
              <p className="text-gray-500 mt-1">{user.email}</p>
              <div className="flex items-center gap-3 mt-3">
                <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  user.role === "ADMIN" 
                    ? "bg-purple-100 text-purple-700 border border-purple-200"
                    : "bg-emerald-100 text-emerald-700 border border-emerald-200"
                }`}>
                  {user.role === "ADMIN" ? "👑 Admin" : "👤 Citizen"}
                </span>
                <span className="text-sm text-gray-400">
                  Member since {new Date().getFullYear()}
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

        {/* Stats Row */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <SummaryCard 
            icon="📊" 
            label="Total Complaints" 
            count={stats.total} 
            color="text-gray-800" 
            bgColor="bg-gray-100" 
          />
          <SummaryCard 
            icon="⏳" 
            label="Pending" 
            count={stats.pending} 
            color="text-red-500" 
            bgColor="bg-red-100" 
          />
          <SummaryCard 
            icon="🔄" 
            label="In Progress" 
            count={stats.inProgress} 
            color="text-yellow-500" 
            bgColor="bg-yellow-100" 
          />
          <SummaryCard 
            icon="✅" 
            label="Resolved" 
            count={stats.resolved} 
            color="text-green-500" 
            bgColor="bg-green-100" 
          />
        </div>

        {/* My Complaints Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">📋 My Complaints</h2>
            <button
              onClick={() => navigate("/report")}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-semibold transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              <span>➕</span>
              New Complaint
            </button>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : complaints.length === 0 ? (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">No complaints yet</h3>
              <p className="text-gray-500 mb-6">Start by reporting an issue in your community.</p>
              <button
                onClick={() => navigate("/report")}
                className="px-6 py-3 bg-emerald-500 text-white rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
              >
                🚀 Report Your First Issue
              </button>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {complaints.slice(0, 6).map((complaint) => (
                <ComplaintCard 
                  key={complaint.id} 
                  complaint={complaint}
                  onViewDetails={handleViewDetails}
                />
              ))}
            </div>
          )}

          {complaints.length > 6 && (
            <div className="text-center mt-6">
              <button
                onClick={() => navigate("/dashboard")}
                className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors"
              >
                View All Complaints →
              </button>
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid md:grid-cols-3 gap-4 mt-6">
          <div 
            onClick={() => navigate("/report")}
            className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl mb-3">📝</div>
            <h3 className="font-bold text-lg mb-1">Report Issue</h3>
            <p className="text-emerald-100 text-sm">Submit a new civic complaint</p>
          </div>

          <div 
            onClick={() => navigate("/public-reports")}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl mb-3">🌍</div>
            <h3 className="font-bold text-lg mb-1">Public Reports</h3>
            <p className="text-blue-100 text-sm">Browse community issues</p>
          </div>

          <div 
            onClick={() => navigate("/notifications")}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300"
          >
            <div className="text-3xl mb-3">🔔</div>
            <h3 className="font-bold text-lg mb-1">Notifications</h3>
            <p className="text-purple-100 text-sm">Stay updated on your reports</p>
          </div>
        </div>

      </div>
    </div>
  )
}

export default Profile

