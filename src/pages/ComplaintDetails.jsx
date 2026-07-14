import { useEffect, useState, useContext } from "react"
import { useParams, useLocation } from "react-router-dom"
import { MapContainer, TileLayer, Marker } from "react-leaflet"
import API from "../services/api"
import { AuthContext } from "../contexts/AuthContext"

function ComplaintDetails() {
  const { id } = useParams()
  const location = useLocation()
  const { user } = useContext(AuthContext)
  const [complaint, setComplaint] = useState(null)
  const [error, setError] = useState("")
  const [info, setInfo] = useState(location.state?.message || "")
  const [voteMsg, setVoteMsg] = useState("")
  const IMAGE_BASE_URL = "http://localhost:8080/"

  const fetchComplaint = async () => {
    try {
      const res = await API.get(`/complaints/${id}`)
      setComplaint(res.data)
    } catch {
      setError("Failed to load complaint")
    }
  }

  useEffect(() => {
    fetchComplaint()
    if (location.state?.message) {
      setInfo(location.state.message)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id])

  const handleUpvote = async () => {
    setVoteMsg("")
    try {
      const res = await API.post(`/votes?userId=${user.id}&complaintId=${id}`)
      if (res.data?.complaint) {
        setComplaint(res.data.complaint)
      } else {
        fetchComplaint()
      }
      setVoteMsg(res.data?.message || "Your support has been added to this complaint.")
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg =
        typeof detail === "string"
          ? detail
          : "You have already supported this complaint."
      setVoteMsg(msg)
    }
  }

  // Helper functions
  const getStatusColor = (status) => {
    switch (status) {
      case "RESOLVED": return "bg-green-500"
      case "IN_PROGRESS": return "bg-yellow-500"
      default: return "bg-red-500"
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "HIGH": return "bg-red-100 text-red-700 border-red-300"
      case "MEDIUM": return "bg-yellow-100 text-yellow-700 border-yellow-300"
      default: return "bg-green-100 text-green-700 border-green-300"
    }
  }

  const formatDate = (dateString) => {
    if (!dateString) return "N/A"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit"
    })
  }

  const getStatusProgress = (status) => {
    switch (status) {
      case "NEW": return 33
      case "IN_PROGRESS": return 66
      case "RESOLVED": return 100
      default: return 0
    }
  }

  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>
  if (!complaint) return <p className="text-center mt-10">Loading...</p>

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-12 px-4">
      <div className="max-w-4xl w-full mx-auto">

        {/* Main Card */}
        <div className="bg-white rounded-3xl shadow-xl overflow-hidden">

          {/* Image Section */}
          {complaint.imageUrl && (
            <div className="relative h-80 bg-gray-100">
              <img
                src={`${IMAGE_BASE_URL}${complaint.imageUrl}`}
                alt="Complaint"
                className="w-full h-full object-cover"
              />
              <div className="absolute top-4 right-4">
                <span className={`${getPriorityColor(complaint.priority)} px-4 py-2 rounded-full font-bold border shadow-lg`}>
                  {complaint.priority || "MEDIUM"} PRIORITY
                </span>
              </div>
            </div>
          )}

          <div className="p-8 space-y-6">

            {info && (
              <div className="bg-amber-50 border border-amber-200 text-amber-800 p-4 rounded-2xl text-sm font-medium">
                {info}
              </div>
            )}

            {voteMsg && (
              <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 p-4 rounded-2xl text-sm font-medium">
                {voteMsg}
              </div>
            )}

            {/* Header */}
            <div className="flex justify-between items-start">
              <div>
                <span className="bg-emerald-100 text-emerald-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {complaint.category || "General"}
                </span>
                <h1 className="text-3xl font-bold text-gray-800 mt-3">
                  {complaint.title || "Civic Issue Report"}
                </h1>
              </div>
              <div className="bg-emerald-50 border border-emerald-200 rounded-2xl px-4 py-3 text-center">
                <p className="text-xs text-emerald-600 font-semibold uppercase tracking-wide">Votes</p>
                <p className="text-2xl font-bold text-emerald-700">👍 {complaint.upvotes || 0}</p>
              </div>
            </div>

            {/* Status Progress Bar */}
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex justify-between text-sm font-medium text-gray-600 mb-2">
                <span>Status</span>
                <span className="capitalize">{complaint.status?.replace("_", " ").toLowerCase() || "new"}</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStatusColor(complaint.status)} transition-all duration-500`}
                  style={{ width: `${getStatusProgress(complaint.status)}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-500 mt-2">
                <span>New</span>
                <span>In Progress</span>
                <span>Resolved</span>
              </div>
            </div>

            {/* Description */}
            <div>
              <h2 className="text-lg font-semibold text-gray-800 mb-2">Description</h2>
              <p className="text-gray-600 leading-relaxed">
                {complaint.description}
              </p>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Department */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Department</p>
                <p className="font-semibold text-gray-800">
                  {complaint.department?.name || "Pending Assignment"}
                </p>
              </div>

              {/* Upvotes */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Community Support</p>
                <p className="font-semibold text-gray-800">
                  👍 {complaint.upvotes || 0} upvotes
                </p>
              </div>

              {/* Created At */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Reported On</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(complaint.createdAt)}
                </p>
              </div>

              {/* Updated At */}
              <div className="bg-gray-50 rounded-xl p-4">
                <p className="text-sm text-gray-500 mb-1">Last Updated</p>
                <p className="font-semibold text-gray-800">
                  {formatDate(complaint.updatedAt)}
                </p>
              </div>
            </div>

            {/* Map */}
            <div className="h-72 rounded-xl overflow-hidden border">
              <MapContainer
                center={[complaint.latitude, complaint.longitude]}
                zoom={15}
                className="h-full w-full"
              >
                <TileLayer
                  attribution='&copy; OpenStreetMap contributors'
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={[complaint.latitude, complaint.longitude]} />
              </MapContainer>
            </div>

            {/* Upvote Button */}
            {user && (
              <button
                onClick={handleUpvote}
                className="w-full bg-emerald-500 text-white py-4 rounded-xl font-semibold text-lg hover:bg-emerald-600 transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                👍 Support This Issue ({complaint.upvotes || 0} community votes)
              </button>
            )}

          </div>
        </div>
      </div>
    </div>
  )
}

export default ComplaintDetails
