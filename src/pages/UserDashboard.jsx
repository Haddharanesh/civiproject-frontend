// UserDashboard.jsx - Citizen Dashboard for CivicConnect
// A modern, friendly dashboard for citizens to track their complaints

import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

// Utility functions for styling
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

// Status Tracker Component
const StatusTracker = ({ currentStatus }) => {
  const stages = [
    { key: "NEW", label: "Reported", icon: "📝" },
    { key: "IN_PROGRESS", label: "In Progress", icon: "🔄" },
    { key: "RESOLVED", label: "Resolved", icon: "✅" }
  ];

  const currentIndex = stages.findIndex(s => s.key === currentStatus);

  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
      <h3 className="text-lg font-bold text-gray-800 mb-6">Complaint Status Tracker</h3>
      <div className="flex items-center justify-between relative">
        {/* Progress Line */}
        <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200 -z-10">
          <div 
            className="h-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${(currentIndex / (stages.length - 1)) * 100}%` }}
          />
        </div>
        
        {stages.map((stage, index) => (
          <div key={stage.key} className="flex flex-col items-center">
            <div 
              className={`w-10 h-10 rounded-full flex items-center justify-center text-lg font-bold transition-all duration-300 ${
                index <= currentIndex 
                  ? "bg-emerald-500 text-white shadow-lg" 
                  : "bg-gray-200 text-gray-400"
              }`}
            >
              {stage.icon}
            </div>
            <p className={`text-sm mt-2 font-medium ${
              index <= currentIndex ? "text-gray-800" : "text-gray-400"
            }`}>
              {stage.label}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

// Complaint Card Component
const ComplaintCard = ({ complaint, onViewDetails }) => (
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

      {/* Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-100">
        <div className="flex items-center gap-2 text-gray-400 text-sm">
          <span>👍</span>
          <span>{complaint.upvotes || 0}</span>
        </div>
        <button
          onClick={() => onViewDetails(complaint.id)}
          className="text-emerald-600 hover:text-emerald-700 font-semibold text-sm flex items-center gap-1 transition-colors"
        >
          View Details →
        </button>
      </div>
    </div>
  </div>
);

// Notification Item Component
const NotificationItem = ({ notification }) => (
  <div className={`p-4 rounded-xl transition-colors ${
    notification.read ? "bg-gray-50" : "bg-emerald-50 border border-emerald-100"
  }`}>
    <div className="flex items-start gap-3">
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm ${
        notification.read ? "bg-gray-200" : "bg-emerald-500 text-white"
      }`}>
        {notification.read ? "📭" : "🔔"}
      </div>
      <div className="flex-1">
        <p className={`text-sm ${notification.read ? "text-gray-600" : "text-gray-800 font-medium"}`}>
          {notification.message}
        </p>
        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
      </div>
      {!notification.read && (
        <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
      )}
    </div>
  </div>
);

// Loading Spinner Component
const LoadingSpinner = () => (
  <div className="flex items-center justify-center py-12">
    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500"></div>
  </div>
);

// Empty State Component
const EmptyState = ({ onReportIssue }) => (
  <div className="text-center py-12">
    <div className="text-6xl mb-4">📋</div>
    <h3 className="text-xl font-bold text-gray-800 mb-2">No complaints found</h3>
    <p className="text-gray-500 mb-6">Try adjusting your filters or report a new issue.</p>
    <button
      onClick={onReportIssue}
      className="bg-emerald-500 text-white px-6 py-3 rounded-xl font-semibold hover:bg-emerald-600 transition-colors"
    >
      🚀 Report New Issue
    </button>
  </div>
);

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

// Main User Dashboard Component
const UserDashboard = () => {
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");
  const [sortBy, setSortBy] = useState("newest");

  // Fetch complaints from backend
  useEffect(() => {
    const fetchComplaints = async () => {
      try {
        setLoading(true);
        const response = await API.get("/complaints/my");
        setComplaints(response.data);
        setError(null);
      } catch (err) {
        console.error("Error fetching complaints:", err);
        setError("Failed to load complaints. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    fetchComplaints();
  }, []);

  // Compute stats from complaints
  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === "NEW").length,
    inProgress: complaints.filter(c => c.status === "IN_PROGRESS").length,
    resolved: complaints.filter(c => c.status === "RESOLVED").length
  };

  // Filter and sort complaints
  const filteredAndSortedComplaints = useMemo(() => {
    let result = [...complaints];

    // Apply filters
    if (statusFilter !== "all") {
      result = result.filter(c => c.status === statusFilter);
    }

    if (categoryFilter !== "all") {
      result = result.filter(c => c.category?.toLowerCase() === categoryFilter.toLowerCase());
    }

    if (priorityFilter !== "all") {
      result = result.filter(c => c.priority === priorityFilter);
    }

    // Apply sorting
    result.sort((a, b) => {
      switch (sortBy) {
        case "oldest":
          return new Date(a.createdAt) - new Date(b.createdAt);
        case "priority-high":
          return priorityOrder(b.priority) - priorityOrder(a.priority);
        case "priority-low":
          return priorityOrder(a.priority) - priorityOrder(b.priority);
        case "newest":
        default:
          return new Date(b.createdAt) - new Date(a.createdAt);
      }
    });

    return result;
  }, [complaints, statusFilter, categoryFilter, priorityFilter, sortBy]);

  // Priority order for sorting
  const priorityOrder = (priority) => {
    switch (priority) {
      case "HIGH": return 3;
      case "MEDIUM": return 2;
      case "LOW": return 1;
      default: return 0;
    }
  };

  const handleViewDetails = (id) => {
    navigate(`/complaint/${id}`);
  };

  const handleReportIssue = () => {
    navigate("/report");
  };

  // Clear all filters
  const clearFilters = () => {
    setStatusFilter("all");
    setCategoryFilter("all");
    setPriorityFilter("all");
    setSortBy("newest");
  };

  // Check if any filters are active
  const hasActiveFilters = statusFilter !== "all" || categoryFilter !== "all" || priorityFilter !== "all" || sortBy !== "newest";

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800">My Dashboard</h1>
            <p className="text-gray-500 mt-1">Welcome back! Here's your complaint overview</p>
          </div>
        </div>

        {/* Summary Cards */}
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

        {/* Main Content Grid */}
        <div className="grid lg:grid-cols-3 gap-6">

          {/* Left Column - Complaints */}
          <div className="lg:col-span-2 space-y-6">
            
            {/* Filters and Sort Controls */}
            <div className="bg-white rounded-2xl shadow-lg p-4">
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
                  Showing <span className="font-semibold text-gray-700">{filteredAndSortedComplaints.length}</span> of <span className="font-semibold text-gray-700">{complaints.length}</span> complaints
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
              <EmptyState onReportIssue={handleReportIssue} />
            )}

            {/* Complaints Grid */}
            {!loading && !error && filteredAndSortedComplaints.length > 0 && (
              <div className="grid md:grid-cols-2 gap-4">
                {filteredAndSortedComplaints.map((complaint) => (
                  <ComplaintCard 
                    key={complaint.id} 
                    complaint={complaint} 
                    onViewDetails={handleViewDetails}
                  />
                ))}
              </div>
            )}

            {/* View All Link */}
            {!loading && !error && complaints.length > 0 && (
              <div className="text-center">
                <button className="text-emerald-600 font-semibold hover:text-emerald-700 transition-colors">
                  View All Complaints →
                </button>
              </div>
            )}
          </div>

          {/* Right Column - Status Tracker & Notifications */}
          <div className="space-y-6">
            
            {/* Status Tracker Example */}
            <StatusTracker currentStatus="IN_PROGRESS" />

            {/* Notifications */}
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-gray-800">Notifications</h3>
                <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">0 new</span>
              </div>
              <div className="space-y-3">
                <NotificationItem 
                  notification={{ 
                    message: "No notifications yet", 
                    time: "", 
                    read: true 
                  }} 
                />
              </div>
              <button className="w-full mt-4 py-2 text-emerald-600 font-semibold hover:bg-emerald-50 rounded-xl transition-colors">
                View All Notifications
              </button>
            </div>

            {/* Quick Actions */}
            <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-2xl p-6 text-white">
              <h3 className="text-lg font-bold mb-2">Quick Actions</h3>
              <p className="text-emerald-100 text-sm mb-4">
                See something wrong in your neighborhood?
              </p>
              <button
                onClick={() => navigate("/report")}
                className="w-full bg-white text-emerald-600 py-3 rounded-xl font-semibold hover:bg-emerald-50 transition-all duration-200 shadow-lg"
              >
                🚀 Report New Issue
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;

