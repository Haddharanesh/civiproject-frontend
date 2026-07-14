import { useContext, useState, useEffect } from "react"
import { AuthContext } from "../contexts/AuthContext"
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"
import API from "../services/api"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})
const createIcon = (color) =>
  new L.Icon({
    iconUrl: `https://maps.google.com/mapfiles/ms/icons/${color}-dot.png`,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
  })

const icons = {
  NEW: createIcon("red"),
  IN_PROGRESS: createIcon("yellow"),
  RESOLVED: createIcon("green"),
}
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
)

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
  </div>
)

function DepartmentDashboard() {
  const { user } = useContext(AuthContext)
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [complaints, setComplaints] = useState([])

  useEffect(() => {

  const fetchStats = async () => {
    try {
      const res = await API.get("/department/dashboard/stats")
      setStats(res.data)
    } catch (err) {
      console.error("Failed to fetch department stats:", err)
    } finally {
      setLoading(false)
    }
  }

  const fetchComplaints = async () => {
    try {
      const res = await API.get("/department/complaints")
      setComplaints(res.data)
    } catch (err) {
      console.error("Failed to fetch complaints:", err)
    }
  }

  fetchStats()
  fetchComplaints()

}, [])

  if (loading) {
    return <LoadingSpinner />
  }

  // Default values if fields are missing
  const total = stats?.TOTAL || 0
  const newCount = stats?.NEW || 0
  const inProgressCount = stats?.IN_PROGRESS || 0
  const resolvedCount = stats?.RESOLVED || 0
  const highPriorityCount = stats?.HIGH_PRIORITY || 0

  // Calculate resolved percentage
  const resolvedPercentage = total > 0 ? Math.round((resolvedCount / total) * 100) : 0

  const topSupported = [...complaints]
    .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
    .slice(0, 5)
  return (
    <div className="max-w-6xl mx-auto">

      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-3xl p-8 mb-8 text-white">
        <h1 className="text-3xl font-bold mb-2">🏛️ Department Dashboard</h1>
        <p className="text-blue-100 text-lg">Welcome back, {user?.name}!</p>
        <p className="text-blue-200 text-sm mt-2">Manage and resolve citizen complaints efficiently</p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
        <SummaryCard 
          icon="📊" 
          label="Total Complaints" 
          count={total} 
          color="text-gray-800" 
          bgColor="bg-gray-100" 
        />
        <SummaryCard 
          icon="📥" 
          label="New" 
          count={newCount} 
          color="text-blue-500" 
          bgColor="bg-blue-100" 
        />
        <SummaryCard 
          icon="🔄" 
          label="In Progress" 
          count={inProgressCount} 
          color="text-yellow-500" 
          bgColor="bg-yellow-100" 
        />
        <SummaryCard 
          icon="✅" 
          label="Resolved" 
          count={resolvedCount} 
          color="text-green-500" 
          bgColor="bg-green-100" 
        />
        <SummaryCard 
          icon="⚠️" 
          label="High Priority" 
          count={highPriorityCount} 
          color="text-red-500" 
          bgColor="bg-red-100" 
        />
      </div>

       {/* 📍 Department Complaints Map */}
{complaints.length > 0 && (
  <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-8">
    <h2 className="text-xl font-bold text-gray-800 mb-4">
      📍 Complaints Map
    </h2>

    <div className="h-96 rounded-xl overflow-hidden border">
      <MapContainer
        center={[
          complaints[0]?.latitude || 11.6643,
          complaints[0]?.longitude || 78.1460
        ]}
        zoom={13}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {complaints.map((c) =>
          c.latitude && c.longitude ? (
            <Marker
  key={c.id}
  position={[c.latitude, c.longitude]}
  icon={icons[c.status] || icons.NEW}
>
              <Popup>
                <strong>{c.title || "Complaint"}</strong><br />
                {c.category}<br />
                {c.status}<br />
                👍 {c.upvotes || 0} community votes
              </Popup>
            </Marker>
          ) : null
        )}
      </MapContainer>
    </div>
  </div>
)}

      {/* Top community-supported issues for prioritization */}
      {topSupported.length > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100 mt-8 mb-8">
          <h2 className="text-xl font-bold text-gray-800 mb-2">🔥 Most Supported Complaints</h2>
          <p className="text-sm text-gray-500 mb-4">
            Prioritize issues with the highest community vote counts
          </p>
          <div className="space-y-3">
            {topSupported.map((c, index) => (
              <div
                key={c.id}
                className="flex items-center justify-between p-4 rounded-xl bg-blue-50/60 border border-blue-100"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="w-8 h-8 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <p className="font-semibold text-gray-800 truncate">{c.title || "Untitled"}</p>
                    <p className="text-xs text-gray-500">
                      {c.category} · {c.status?.replace("_", " ")} · {c.priority} priority
                    </p>
                  </div>
                </div>
                <span className="ml-3 shrink-0 inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-white text-blue-700 font-bold text-sm border border-blue-200">
                  👍 {c.upvotes || 0}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-4 mb-8">
        <div 
          onClick={() => window.location.href = "/department/review"}
          className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl mb-3">📋</div>
              <h3 className="font-bold text-lg mb-1">Review Complaints</h3>
              <p className="text-blue-100 text-sm">Manage citizen complaints</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <span className="text-2xl">→</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => window.location.href = "/department/reports"}
          className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl mb-3">📊</div>
              <h3 className="font-bold text-lg mb-1">Reports</h3>
              <p className="text-purple-100 text-sm">View department analytics</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <span className="text-2xl">→</span>
            </div>
          </div>
        </div>

        <div 
          onClick={() => window.location.href = "/department/profile"}
          className="bg-gradient-to-br from-indigo-500 to-indigo-600 rounded-2xl p-6 text-white cursor-pointer hover:shadow-xl transition-all duration-300"
        >
          <div className="flex items-center justify-between">
            <div>
              <div className="text-3xl mb-3">👤</div>
              <h3 className="font-bold text-lg mb-1">My Profile</h3>
              <p className="text-indigo-100 text-sm">Account settings</p>
            </div>
            <div className="bg-white/20 p-3 rounded-xl">
              <span className="text-2xl">→</span>
            </div>
          </div>
        </div>
      </div>

      {/* Performance Overview */}
      {total > 0 && (
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
          <h2 className="text-xl font-bold text-gray-800 mb-6">📈 Performance Overview</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#22c55e"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${Math.round((resolvedCount / total) * 352)} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{resolvedPercentage}%</span>
                </div>
              </div>
              <p className="text-gray-600 font-medium">Resolution Rate</p>
              <p className="text-sm text-gray-400">{resolvedPercentage}% complaints resolved</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#eab308"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${Math.round(((newCount + inProgressCount) / total) * 352)} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{100 - resolvedPercentage}%</span>
                </div>
              </div>
              <p className="text-gray-600 font-medium">Pending Rate</p>
              <p className="text-sm text-gray-400">{100 - resolvedPercentage}% complaints pending</p>
            </div>
            <div className="text-center">
              <div className="relative w-32 h-32 mx-auto mb-3">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#e5e7eb"
                    strokeWidth="12"
                    fill="none"
                  />
                  <circle
                    cx="64"
                    cy="64"
                    r="56"
                    stroke="#ef4444"
                    strokeWidth="12"
                    fill="none"
                    strokeDasharray={`${Math.round((highPriorityCount / total) * 352)} 352`}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-800">{Math.round((highPriorityCount / total) * 100)}%</span>
                </div>
              </div>
              <p className="text-gray-600 font-medium">High Priority</p>
              <p className="text-sm text-red-500">{highPriorityCount} high priority complaints</p>
            </div>
          </div>
        </div>
      )}
      
       
    </div>
  )
}

export default DepartmentDashboard
