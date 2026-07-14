import { useEffect, useState, useContext, useMemo } from "react"
import { Link } from "react-router-dom"
import API from "../services/api"
import { AuthContext } from "../contexts/AuthContext"

// Utility functions for styling (matching other pages)
const getStatusColor = (status) => {
  switch (status) {
    case "RESOLVED": return "bg-green-500";
    case "IN_PROGRESS": return "bg-yellow-500";
    default: return "bg-red-500";
  }
};

const getStatusBadge = (status) => {
  switch (status) {
    case "RESOLVED": return "bg-green-100 text-green-700 border-green-200";
    case "IN_PROGRESS": return "bg-yellow-100 text-yellow-700 border-yellow-200";
    default: return "bg-red-100 text-red-700 border-red-200";
  }
};

const getPriorityBadge = (priority) => {
  switch (priority) {
    case "HIGH": return "bg-red-100 text-red-700 border-red-200";
    case "MEDIUM": return "bg-orange-100 text-orange-700 border-orange-200";
    default: return "bg-gray-100 text-gray-600 border-gray-200";
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

// Filter Dropdown Component
const FilterDropdown = ({ label, value, onChange, options }) => (
  <div className="flex flex-col gap-1">
    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</label>
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="bg-white border border-gray-200 text-gray-700 py-2 px-3 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
    >
      {options.map((option) => (
        <option key={option.value} value={option.value}>
          {option.label}
        </option>
      ))}
    </select>
  </div>
);

// Complaint Card Component (matching ComplaintCard.jsx style)
const ComplaintCard = ({ complaint, onUpvote, user }) => {
  const hasVoted = user && complaint.votedBy?.includes(user.id);

  return (
    <div className="bg-white rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 overflow-hidden group">
      {/* Image Preview */}
      {complaint.imageUrl && (
        <div className="relative h-40 overflow-hidden">
          <img
            src={`http://localhost:8080/${complaint.imageUrl}`}
            alt={complaint.title || "Issue"}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
          <div className="absolute bottom-3 left-3">
            <span className="bg-white/90 backdrop-blur text-gray-800 text-xs px-3 py-1 rounded-full font-semibold">
              {getCategoryIcon(complaint.category)} {complaint.category}
            </span>
          </div>
          <div className="absolute top-3 right-3">
            <span className={`${getPriorityBadge(complaint.priority)} px-2 py-1 rounded-full text-xs font-bold border`}>
              {complaint.priority}
            </span>
          </div>
        </div>
      )}

      {/* Card Body */}
      <div className="p-5">
        {/* Header without image */}
        {!complaint.imageUrl && (
          <div className="flex justify-between items-start mb-3">
            <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold">
              {getCategoryIcon(complaint.category)} {complaint.category}
            </span>
            <span className={`${getPriorityBadge(complaint.priority)} px-2 py-1 rounded-full text-xs font-bold border`}>
              {complaint.priority}
            </span>
          </div>
        )}

        <h3 className="text-lg font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
          {complaint.title || "Untitled Issue"}
        </h3>

        <p className="text-gray-600 text-sm mb-4 line-clamp-2">
          {complaint.description}
        </p>

        {/* Status & Info */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${getStatusColor(complaint.status)}`}></span>
            <span className={`${getStatusBadge(complaint.status)} px-3 py-1 rounded-full text-xs font-semibold`}>
              {complaint.status?.replace("_", " ")}
            </span>
          </div>
          <span className="text-gray-400 text-sm">{formatDate(complaint.createdAt)}</span>
        </div>

        {/* Footer with upvote */}
        <div className="flex items-center justify-between pt-3 border-t border-gray-100">
          <button
            onClick={() => onUpvote(complaint.id)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-sm font-medium transition-colors ${
              hasVoted 
                ? "bg-emerald-100 text-emerald-700" 
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            <span>👍</span>
            <span>{complaint.upvotes || 0}</span>
          </button>
          <Link
            to={`/complaint/${complaint.id}`}
            className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 transition-colors"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
  </div>
);

// Empty State Component
const EmptyState = () => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">📋</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">No public reports found</h3>
    <p className="text-gray-500">Try adjusting your filters.</p>
  </div>
);

function PublicReports() {
  const [complaints, setComplaints] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const { user } = useContext(AuthContext)

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all")
  const [categoryFilter, setCategoryFilter] = useState("all")
  const [priorityFilter, setPriorityFilter] = useState("all")
  const [sortBy, setSortBy] = useState("newest")

  const fetchComplaints = async () => {
    try {
      setLoading(true)
      const res = await API.get("/complaints/public")
      setComplaints(res.data)
      setError(null)
    } catch (err) {
      console.error("Failed to fetch complaints", err)
      setError("Failed to load public reports. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchComplaints()
  }, [])

  // Filter and sort complaints
  const filteredAndSortedComplaints = useMemo(() => {
    let result = [...complaints]

    // Apply filters
    if (statusFilter !== "all") {
      result = result.filter(c => c.status === statusFilter)
    }

    if (categoryFilter !== "all") {
      result = result.filter(c => c.category?.toLowerCase() === categoryFilter.toLowerCase())
    }

    if (priorityFilter !== "all") {
      result = result.filter(c => c.priority === priorityFilter)
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt)
        case "priority-high":
          return priorityOrder(b.priority) - priorityOrder(a.priority)
        case "priority-low":
          return priorityOrder(a.priority) - priorityOrder(b.priority)
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt)
      }
    })

    return result
  }, [complaints, statusFilter, categoryFilter, priorityFilter, sortBy])

  // Priority order for sorting
  const priorityOrder = (priority) => {
    switch (priority) {
      case "HIGH": return 3
      case "MEDIUM": return 2
      case "LOW": return 1
      default: return 0
    }
  }

  const handleUpvote = async (id) => {
    if (!user) {
      alert("Please login to vote")
      return
    }

    try {
      await API.post(`/votes?userId=${user.id}&complaintId=${id}`)
      fetchComplaints() // refresh votes
    } catch (err) {
      const detail = err.response?.data?.detail
      const msg =
        typeof detail === "string"
          ? detail
          : "You have already supported this complaint."
      alert(msg)
    }
  }

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all")
    setCategoryFilter("all")
    setPriorityFilter("all")
    setSortBy("newest")
  }

  // Check if any filters are active
  const hasActiveFilters = statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all" || sortBy !== "newest"

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800">Public Reported Issues</h1>
          <p className="text-gray-500 mt-2">Browse and upvote issues reported by your community</p>
        </div>

        {/* Filters and Sort Controls */}
        <div className="bg-white rounded-2xl shadow-lg p-4 mb-8">
          <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-4">
            
            {/* Filter Dropdowns */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 flex-1">
              <FilterDropdown
                label="Status"
                value={statusFilter}
                onChange={setStatusFilter}
                options={[
                  { value: "all", label: "All Status" },
                  { value: "NEW", label: "Pending" },
                  { value: "IN_PROGRESS", label: "In Progress" },
                  { value: "RESOLVED", label: "Resolved" }
                ]}
              />
              <FilterDropdown
                label="Category"
                value={categoryFilter}
                onChange={setCategoryFilter}
                options={[
                  { value: "all", label: "All Categories" },
                  { value: "road", label: "🛣️ Road" },
                  { value: "waste", label: "🗑️ Waste" },
                  { value: "water", label: "💧 Water" },
                  { value: "electricity", label: "⚡ Electricity" }
                ]}
              />
              <FilterDropdown
                label="Priority"
                value={priorityFilter}
                onChange={setPriorityFilter}
                options={[
                  { value: "all", label: "All Priority" },
                  { value: "HIGH", label: "🔴 High" },
                  { value: "MEDIUM", label: "🟠 Medium" },
                  { value: "LOW", label: "⚪ Low" }
                ]}
              />
              <FilterDropdown
                label="Sort By"
                value={sortBy}
                onChange={setSortBy}
                options={[
                  { value: "newest", label: "📅 Newest First" },
                  { value: "oldest", label: "📅 Oldest First" },
                  { value: "priority-high", label: "🔼 Priority High" },
                  { value: "priority-low", label: "🔽 Priority Low" }
                ]}
              />
            </div>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-xl transition-colors"
              >
                Clear Filters ✕
              </button>
            )}
          </div>

          {/* Results Count */}
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-500">
              Showing <span className="font-semibold text-gray-700">{filteredAndSortedComplaints.length}</span> of <span className="font-semibold text-gray-700">{complaints.length}</span> reports
            </p>
          </div>
        </div>

        {/* Loading State */}
        {loading && <LoadingSpinner />}

        {/* Error State */}
        {!loading && error && (
          <div className="bg-red-50 border border-red-200 rounded-2xl p-6 text-center">
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && filteredAndSortedComplaints.length === 0 && (
          <EmptyState />
        )}

        {/* Complaints Grid */}
        {!loading && !error && filteredAndSortedComplaints.length > 0 && (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredAndSortedComplaints.map((complaint) => (
              <ComplaintCard 
                key={complaint.id} 
                complaint={complaint}
                onUpvote={handleUpvote}
                user={user}
              />
            ))}
          </div>
        )}

        {/* View All Link */}
        {!loading && !error && complaints.length > 0 && (
          <div className="text-center mt-8">
            <Link to="/analytics" className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
              View Analytics →
            </Link>
          </div>
        )}

      </div>
    </div>
  )
}

export default PublicReports

