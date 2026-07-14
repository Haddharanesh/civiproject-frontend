import { useState, useEffect } from "react"
import API from "../services/api"
import { IMAGE_BASE_URL } from "../config"

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png",
})
// Format date

const formatDate = (dateString) => {
  if (!dateString) return ""
  return new Date(dateString).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric"
  })
}

// Get priority badge color
const getPriorityColor = (priority) => {
  switch (priority) {
    case "HIGH":
      return "bg-red-100 text-red-700 border-red-200"
    case "MEDIUM":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "LOW":
      return "bg-green-100 text-green-700 border-green-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

// Get status badge color
const getStatusColor = (status) => {
  switch (status) {
    case "NEW":
      return "bg-blue-100 text-blue-700 border-blue-200"
    case "IN_PROGRESS":
      return "bg-yellow-100 text-yellow-700 border-yellow-200"
    case "RESOLVED":
      return "bg-green-100 text-green-700 border-green-200"
    default:
      return "bg-gray-100 text-gray-700 border-gray-200"
  }
}

// Remarks Modal Component
const RemarksModal = ({ isOpen, onClose, complaint, onSubmit }) => {
  const [remarks, setRemarks] = useState("")
  const [loading, setLoading] = useState(false)

 
  useEffect(() => {
    if (complaint?.remarks) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setRemarks(complaint.remarks)
    }
  }, [complaint])

  if (!isOpen || !complaint) return null

  const handleSubmit = async () => {
    if (!remarks.trim()) return
    setLoading(true)
    await onSubmit(complaint.id, remarks)
    setLoading(false)
    setRemarks("")
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800">Add Remarks</h3>
          <p className="text-sm text-gray-500 mt-1">{complaint.title}</p>
        </div>

        {/* Content */}
        <div className="p-6">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Remarks for Citizen
          </label>
          <textarea
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="Enter your remarks about this complaint..."
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            rows={4}
          />
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={loading || !remarks.trim()}
            className="px-6 py-2 bg-blue-500 text-white font-medium rounded-xl hover:bg-blue-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Saving..." : "Save Remarks"}
          </button>
        </div>
      </div>
    </div>
  )
}

// View Complaint Modal
const ViewComplaintModal = ({ isOpen, onClose, complaint }) => {
  if (!isOpen || !complaint) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header */}
        <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-800">Complaint Details</h3>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="p-6 max-h-[70vh] overflow-y-auto">
          {/* Image */}
          {complaint.imageUrl && (
            <img
              src={`${IMAGE_BASE_URL}${complaint.imageUrl}`}
              alt={complaint.title}
              className="w-full h-48 object-cover rounded-xl mb-4"
            />
          )}
          {/* 📍 Location Map */}
{complaint.latitude && complaint.longitude && (
  <div className="mb-4">
    <span className="text-xs text-gray-500 uppercase tracking-wide">Location</span>

    <div className="h-64 mt-2 rounded-xl overflow-hidden border">
      <MapContainer
        center={[complaint.latitude, complaint.longitude]}
        zoom={15}
        style={{ height: "100%", width: "100%" }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        <Marker position={[complaint.latitude, complaint.longitude]}>
          <Popup>📍 Complaint Location</Popup>
        </Marker>
      </MapContainer>
    </div>

    {/* Optional coordinates */}
    <p className="text-xs text-gray-400 mt-1">
      Lat: {complaint.latitude}, Lng: {complaint.longitude}
    </p>
  </div>
)}

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Category</span>
              <p className="font-medium text-gray-800">{complaint.category}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Priority</span>
              <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                {complaint.priority}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Status</span>
              <span className={`inline-block px-2 py-1 rounded-lg text-xs font-medium border ${getStatusColor(complaint.status)}`}>
                {complaint.status.replace("_", " ")}
              </span>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Community Votes</span>
              <p className="font-medium text-gray-800">👍 {complaint.upvotes || 0}</p>
            </div>
            <div>
              <span className="text-xs text-gray-500 uppercase tracking-wide">Created</span>
              <p className="font-medium text-gray-800">{formatDate(complaint.createdAt)}</p>
            </div>
          </div>

          <div className="mb-4">
            <span className="text-xs text-gray-500 uppercase tracking-wide">Description</span>
            <p className="text-gray-700 mt-1">{complaint.description}</p>
          </div>

          {complaint.remarks && (
            <div className="bg-blue-50 rounded-xl p-4">
              <span className="text-xs text-blue-600 uppercase tracking-wide font-medium">Department Remarks</span>
              <p className="text-gray-700 mt-1">{complaint.remarks}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
          <button
            onClick={onClose}
            className="w-full px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}

function DepartmentReview() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")
  const [filter, setFilter] = useState("ALL")
  const [viewComplaint, setViewComplaint] = useState(null)
  const [remarksModal, setRemarksModal] = useState({ open: false, complaint: null })
  const [updatingStatus, setUpdatingStatus] = useState({})

  useEffect(() => {
    fetchComplaints()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [filter])

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const endpoint = filter === "ALL" 
        ? "/department/complaints" 
        : `/department/complaints/filter?status=${filter}`
      const res = await API.get(endpoint)
      setComplaints(res.data)
    } catch (err) {
      console.error("Failed to fetch complaints:", err)
      setError("Failed to load complaints")
    } finally {
      setLoading(false)
    }
  }

  const updateStatus = async (complaintId, newStatus) => {
    try {
      setUpdatingStatus(prev => ({ ...prev, [complaintId]: true }))
      await API.put(`/department/complaints/${complaintId}/status?status=${newStatus}`)
      setComplaints(complaints.map(c => 
        c.id === complaintId ? { ...c, status: newStatus } : c
      ))
    } catch (err) {
      console.error("Failed to update status:", err)
      alert("Failed to update status")
    } finally {
      setUpdatingStatus(prev => ({ ...prev, [complaintId]: false }))
    }
  }

  const submitRemarks = async (complaintId, remarks) => {
    try {
      await API.put(`/department/complaints/${complaintId}/remarks?remarks=${encodeURIComponent(remarks)}`)
      setComplaints(complaints.map(c => 
        c.id === complaintId ? { ...c, remarks } : c
      ))
    } catch (err) {
      console.error("Failed to add remarks:", err)
      alert("Failed to add remarks")
    }
  }

  const complaintCounts = {
    ALL: complaints.length,
    NEW: complaints.filter(c => c.status === "NEW").length,
    IN_PROGRESS: complaints.filter(c => c.status === "IN_PROGRESS").length,
    RESOLVED: complaints.filter(c => c.status === "RESOLVED").length
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading complaints...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Review Complaints</h1>
          <p className="text-gray-500 mt-1">Manage and respond to citizen complaints</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Filter Tabs */}
        <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
          {["ALL", "NEW", "IN_PROGRESS", "RESOLVED"].map((status) => (
            <button
              key={status}
              onClick={() => setFilter(status)}
              className={`px-5 py-2.5 rounded-xl text-sm font-medium whitespace-nowrap transition-all ${
                filter === status
                  ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
                  : "bg-white text-gray-600 hover:bg-gray-50 shadow-sm"
              }`}
            >
              {status.replace("_", " ")} ({complaintCounts[status]})
            </button>
          ))}
        </div>

        {/* Complaints Table */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          {complaints.length === 0 ? (
            <div className="p-12 text-center">
              <div className="text-6xl mb-4">📋</div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">No complaints found</h3>
              <p className="text-gray-500">
                {filter === "ALL" 
                  ? "No complaints have been assigned to your department yet." 
                  : `No ${filter.toLowerCase().replace("_", " ")} complaints.`}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-100">
                  <tr>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Title</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Priority</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Votes</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {[...complaints]
                    .sort((a, b) => (b.upvotes || 0) - (a.upvotes || 0))
                    .map((complaint) => (
                    <tr key={complaint.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4">
                        <p className="font-medium text-gray-800 truncate max-w-xs">{complaint.title}</p>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-600">{complaint.category}</span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`inline-block px-2.5 py-1 rounded-lg text-xs font-medium border ${getPriorityColor(complaint.priority)}`}>
                          {complaint.priority}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className="inline-flex items-center gap-1 text-sm font-semibold text-blue-700 bg-blue-50 px-2.5 py-1 rounded-lg">
                          👍 {complaint.upvotes || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <select
                          value={complaint.status}
                          onChange={(e) => updateStatus(complaint.id, e.target.value)}
                          disabled={updatingStatus[complaint.id]}
                          className={`px-3 py-1.5 rounded-lg text-xs font-medium border bg-white cursor-pointer ${getStatusColor(complaint.status)}`}
                        >
                          <option value="NEW">NEW</option>
                          <option value="IN_PROGRESS">IN PROGRESS</option>
                          <option value="RESOLVED">RESOLVED</option>
                        </select>
                      </td>
                      <td className="px-6 py-4">
                        <span className="text-sm text-gray-500">{formatDate(complaint.createdAt)}</span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => setViewComplaint(complaint)}
                            className="px-3 py-1.5 text-xs font-medium text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition-colors"
                          >
                            View
                          </button>
                          <button
                            onClick={() => setRemarksModal({ open: true, complaint })}
                            className="px-3 py-1.5 text-xs font-medium text-gray-600 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                          >
                            Remarks
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

      </div>

      {/* View Complaint Modal */}
      <ViewComplaintModal
        isOpen={!!viewComplaint}
        onClose={() => setViewComplaint(null)}
        complaint={viewComplaint}
      />

      {/* Remarks Modal */}
      <RemarksModal
        isOpen={remarksModal.open}
        onClose={() => setRemarksModal({ open: false, complaint: null })}
        complaint={remarksModal.complaint}
        onSubmit={submitRemarks}
      />
    </div>
  )
}

export default DepartmentReview

