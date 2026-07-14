import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../services/api";

function MyComplaints() {
  const [complaints, setComplaints] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ total: 0, new: 0, inProgress: 0, resolved: 0 });
  const navigate = useNavigate();

  // Calculate stats from complaints
  const calculateStats = (data) => {
    setStats({
      total: data.length,
      new: data.filter(c => c.status === "NEW").length,
      inProgress: data.filter(c => c.status === "IN_PROGRESS").length,
      resolved: data.filter(c => c.status === "RESOLVED").length
    });
  };

  useEffect(() => {
    API.get("/complaints/my")
      .then(res => {
        setComplaints(res.data);
        calculateStats(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  // Helper functions for color coding
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
      case "MEDIUM": return "bg-yellow-100 text-yellow-700 border-yellow-200";
      default: return "bg-green-100 text-green-700 border-green-200";
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
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric"
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-emerald-500 mx-auto mb-4"></div>
          <p className="text-gray-500">Loading your complaints...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-white to-emerald-100 py-8 px-4">
      <div className="max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="mb-10">
          <h2 className="text-4xl font-bold text-gray-800 mb-2">
            My Complaints
          </h2>
          <p className="text-gray-500 text-lg">
            Track and manage your civic reports
          </p>
        </div>

        {/* Stats Cards */}
        {complaints.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-4xl font-bold text-emerald-600">{stats.total}</div>
              <div className="text-gray-500 text-sm font-medium">Total Complaints</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-4xl font-bold text-red-500">{stats.new}</div>
              <div className="text-gray-500 text-sm font-medium">New</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-4xl font-bold text-yellow-500">{stats.inProgress}</div>
              <div className="text-gray-500 text-sm font-medium">In Progress</div>
            </div>
            <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
              <div className="text-4xl font-bold text-green-500">{stats.resolved}</div>
              <div className="text-gray-500 text-sm font-medium">Resolved</div>
            </div>
          </div>
        )}

        {/* Empty State */}
        {complaints.length === 0 ? (
          <div className="bg-white rounded-3xl shadow-xl p-12 text-center">
            <div className="text-8xl mb-6">📋</div>
            <h3 className="text-2xl font-bold text-gray-700 mb-3">
              No complaints yet
            </h3>
            <p className="text-gray-500 text-lg mb-8 max-w-md mx-auto">
              You haven't reported any civic issues yet. Be the first to make a difference in your community!
            </p>
            <button
              onClick={() => navigate("/report")}
              className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-2xl font-semibold text-lg shadow-lg hover:shadow-xl transition-all duration-300"
            >
              🚀 Report an Issue
            </button>
          </div>
        ) : (
          <>
            {/* Filter/Sort Header */}
            <div className="flex justify-between items-center mb-6">
              <p className="text-gray-500">
                Showing {complaints.length} complaint{complaints.length !== 1 ? 's' : ''}
              </p>
            </div>

            {/* Complaints Grid */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {complaints.map((c) => (
                <div
                  key={c.id}
                  className="bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group"
                >
                  {/* Image Preview */}
                  {c.imageUrl && (
                    <div className="relative h-48 overflow-hidden">
                      <img
                        src={`http://localhost:8080/${c.imageUrl}`}
                        alt="Complaint"
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent"></div>
                      <div className="absolute bottom-3 left-3">
                        <span className="bg-white/90 backdrop-blur text-gray-800 text-xs px-3 py-1 rounded-full font-semibold">
                          {getCategoryIcon(c.category)} {c.category || "General"}
                        </span>
                      </div>
                      <div className="absolute top-3 right-3">
                        <span className={`${getPriorityBadge(c.priority)} px-2 py-1 rounded-full text-xs font-bold border`}>
                          {c.priority || "MEDIUM"}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Card Body */}
                  <div className="p-6">
                    {!c.imageUrl && (
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-gray-100 text-gray-700 text-xs px-3 py-1 rounded-full font-semibold">
                          {getCategoryIcon(c.category)} {c.category || "General"}
                        </span>
                        <span className={`${getPriorityBadge(c.priority)} px-2 py-1 rounded-full text-xs font-bold border`}>
                          {c.priority || "MEDIUM"}
                        </span>
                      </div>
                    )}

                    {/* Title */}
                    <h3 className="text-xl font-bold text-gray-800 mb-2 group-hover:text-emerald-600 transition-colors">
                      {c.title || "Civic Issue Report"}
                    </h3>

                    {/* Description */}
                    <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                      {c.description ? c.description.substring(0, 100) + "..." : "No description provided"}
                    </p>

                    {/* Status Progress */}
                    <div className="mb-4">
                      <div className="flex justify-between text-xs text-gray-500 mb-1">
                        <span>Progress</span>
                        <span className="capitalize">{c.status?.replace("_", " ").toLowerCase() || "new"}</span>
                      </div>
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div
                          className={`h-full ${getStatusColor(c.status)} transition-all duration-500`}
                          style={{
                            width: c.status === "NEW" ? "33%" : c.status === "IN_PROGRESS" ? "66%" : "100%"
                          }}
                        ></div>
                      </div>
                    </div>

                    {/* Info Grid */}
                    <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-400 text-xs mb-1">📅 Reported</p>
                        <p className="font-semibold text-gray-700">{formatDate(c.createdAt)}</p>
                      </div>
                      <div className="bg-gray-50 rounded-xl p-3">
                        <p className="text-gray-400 text-xs mb-1">🏢 Department</p>
                        <p className="font-semibold text-gray-700 truncate">{c.department?.name || "Pending"}</p>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${getStatusColor(c.status)}`}></span>
                        <span className={`${getStatusBadge(c.status)} px-3 py-1 rounded-full text-xs font-semibold`}>
                          {c.status || "NEW"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-gray-400 text-sm">
                        <span>👍</span>
                        <span className="font-medium text-gray-600">{c.upvotes || 0}</span>
                      </div>
                    </div>

                    {/* View Details Button */}
                    <button
                      onClick={() => navigate(`/complaint/${c.id}`)}
                      className="mt-4 w-full bg-gradient-to-r from-emerald-500 to-emerald-600 text-white py-3 rounded-xl font-semibold hover:from-emerald-600 hover:to-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default MyComplaints;
