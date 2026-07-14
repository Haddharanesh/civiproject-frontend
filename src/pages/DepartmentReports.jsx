import { useState, useEffect } from "react"
import API from "../services/api"
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"

function DepartmentReports() {
  const [stats, setStats] = useState({
    TOTAL: 0,
    NEW: 0,
    IN_PROGRESS: 0,
    RESOLVED: 0,
    HIGH_PRIORITY: 0
  })
  const [priorityData, setPriorityData] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState("")

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [statsRes, priorityRes] = await Promise.all([
        API.get("/department/dashboard/stats"),
        API.get("/department/reports/priority")
      ])
      setStats(statsRes.data)
      setPriorityData(formatPriorityData(priorityRes.data))
    } catch (err) {
      console.error("Failed to fetch reports:", err)
      setError("Failed to load reports")
    } finally {
      setLoading(false)
    }
  }

  const formatPriorityData = (data) => {
    return Object.entries(data).map(([priority, count]) => ({
      name: priority,
      value: count
    }))
  }

  const statusData = [
    { name: "NEW", value: stats.NEW, color: "#3B82F6" },
    { name: "IN_PROGRESS", value: stats.IN_PROGRESS, color: "#F59E0B" },
    { name: "RESOLVED", value: stats.RESOLVED, color: "#10B981" }
  ]

  const COLORS = ["#EF4444", "#F59E0B", "#10B981", "#3B82F6", "#8B5CF6"]

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="text-gray-500 mt-4">Loading reports...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-50 py-8">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Department Reports</h1>
          <p className="text-gray-500 mt-1">Analytics and statistics for your department</p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6">
            {error}
          </div>
        )}

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-gray-500 mb-1">Total</div>
            <div className="text-3xl font-bold text-gray-800">{stats.TOTAL}</div>
            <div className="text-xs text-gray-400 mt-1">All Complaints</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-blue-600 mb-1">NEW</div>
            <div className="text-3xl font-bold text-blue-600">{stats.NEW}</div>
            <div className="text-xs text-gray-400 mt-1">Pending</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-yellow-600 mb-1">IN PROGRESS</div>
            <div className="text-3xl font-bold text-yellow-600">{stats.IN_PROGRESS}</div>
            <div className="text-xs text-gray-400 mt-1">Processing</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <div className="text-sm text-green-600 mb-1">RESOLVED</div>
            <div className="text-3xl font-bold text-green-600">{stats.RESOLVED}</div>
            <div className="text-xs text-gray-400 mt-1">Completed</div>
          </div>
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-red-100">
            <div className="text-sm text-red-600 mb-1">HIGH PRIORITY</div>
            <div className="text-3xl font-bold text-red-600">{stats.HIGH_PRIORITY}</div>
            <div className="text-xs text-gray-400 mt-1">Urgent</div>
          </div>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          
          {/* Status Pie Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Status Distribution</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={statusData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {statusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" height={36} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Priority Bar Chart */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
            <h2 className="text-lg font-semibold text-gray-800 mb-4">Priority Breakdown</h2>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={priorityData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                  <XAxis dataKey="name" stroke="#6B7280" fontSize={12} />
                  <YAxis stroke="#6B7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #E5E7EB",
                      borderRadius: "8px"
                    }}
                  />
                  <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                    {priorityData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-6 bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Performance Metrics</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-blue-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">Resolution Rate</div>
              <div className="text-2xl font-bold text-blue-600">
                {stats.TOTAL > 0 ? Math.round((stats.RESOLVED / stats.TOTAL) * 100) : 0}%
              </div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">In Progress Rate</div>
              <div className="text-2xl font-bold text-yellow-600">
                {stats.TOTAL > 0 ? Math.round((stats.IN_PROGRESS / stats.TOTAL) * 100) : 0}%
              </div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-xl">
              <div className="text-sm text-gray-500 mb-1">New Rate</div>
              <div className="text-2xl font-bold text-green-600">
                {stats.TOTAL > 0 ? Math.round((stats.NEW / stats.TOTAL) * 100) : 0}%
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}

export default DepartmentReports

