import { useState, useEffect, useContext } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"
import { AuthContext } from "../contexts/AuthContext"

function SuperAdminDashboard() {
  const { user, logout } = useContext(AuthContext)
  const navigate = useNavigate()
  const [stats, setStats] = useState({
    users: 0,
    departments: 0,
    complaints: 0
  })
  const [loading, setLoading] = useState(true)
  const [activeSection, setActiveSection] = useState("overview")
  const [currentPage, setCurrentPage] = useState(1)
  const usersPerPage = 5
  const [complaintPage, setComplaintPage] = useState(1)
  const complaintsPerPage = 5
  
  // Data states
  const [users, setUsers] = useState([])
  const [departments, setDepartments] = useState([])
  const [complaints, setComplaints] = useState([])
  const [actionLoading, setActionLoading] = useState(false)
  const [message, setMessage] = useState({ type: "", text: "" })
  // 🔍 Search + Filters
  const [userSearch, setUserSearch] = useState("")
  const [roleFilter, setRoleFilter] = useState("")

  const [complaintSearch, setComplaintSearch] = useState("")
  const [statusFilter, setStatusFilter] = useState("")
  const [priorityFilter, setPriorityFilter] = useState("")
  
  const [newAdmin, setNewAdmin] = useState({
  name: "",
  email: "",
  password: "",
  departmentId: ""
})
  // Form states
  const [newDepartment, setNewDepartment] = useState({ name: "", description: "" })

  useEffect(() => {
    fetchData()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      const [usersRes, departmentsRes, complaintsRes] = await Promise.all([
        API.get("/superadmin/users"),
        API.get("/superadmin/departments"),
        API.get("/superadmin/complaints")
      ])

      setStats({
        users: usersRes.data.length,
        departments: departmentsRes.data.length,
        complaints: complaintsRes.data.length
      })
      setUsers(usersRes.data)
      setDepartments(departmentsRes.data)
      setComplaints(complaintsRes.data)
    } catch (error) {
      console.error("Error fetching data:", error)
      showMessage("error", "Failed to fetch data")
    } finally {
      setLoading(false)
    }
  }

  const showMessage = (type, text) => {
    setMessage({ type, text })
    setTimeout(() => setMessage({ type: "", text: "" }), 3000)
  }

 

  // Department actions
  const handleCreateDepartment = async (e) => {
    e.preventDefault()
    if (!newDepartment.name.trim()) {
      showMessage("error", "Department name is required")
      return
    }
    try {
      setActionLoading(true)
      await API.post("/superadmin/departments", newDepartment)
      showMessage("success", "Department created successfully")
      setNewDepartment({ name: "", description: "" })
      fetchData()
    } catch (error) {
      showMessage("error", error.response?.data || "Failed to create department")
    } finally {
      setActionLoading(false)
    }
  }
  const handleDeleteUser = async (userId) => {
  if (!window.confirm("Are you sure you want to delete this user?")) return

  try {
    setActionLoading(true)
    await API.delete(`/superadmin/users/${userId}`)
    showMessage("success", "User deleted successfully")
    fetchData()
  } catch (error) {
    showMessage("error", error.response?.data || "Failed to delete user")
  } finally {
    setActionLoading(false)
  }
}

  const handleDeleteDepartment = async (deptId) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return
    try {
      setActionLoading(true)
      await API.delete(`/superadmin/departments/${deptId}`)
      showMessage("success", "Department deleted successfully")
      fetchData()
    } catch (error) {
      showMessage("error", error.response?.data || "Failed to delete department")
    } finally {
      setActionLoading(false)
    }
  }

  // Complaint actions
  const handleDeleteComplaint = async (complaintId) => {
    if (!window.confirm("Are you sure you want to delete this complaint?")) return
    try {
      setActionLoading(true)
      await API.delete(`/superadmin/complaints/${complaintId}`)
      showMessage("success", "Complaint deleted successfully")
      fetchData()
    } catch (error) {
      showMessage("error", error.response?.data || "Failed to delete complaint")
    } finally {
      setActionLoading(false)
    }
  }

  const handleLogout = () => {
    logout()
    navigate("/login")
  }

  // 👥 Filtered Users
const filteredUsers = users.filter((u) => {
  return (
    u.name.toLowerCase().includes(userSearch.toLowerCase()) &&
    (roleFilter ? u.role === roleFilter : true)
  )
})

// 🔥 PAGINATION LOGIC (PASTE HERE)
const indexOfLastUser = currentPage * usersPerPage
const indexOfFirstUser = indexOfLastUser - usersPerPage

const paginatedUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser)

const totalPages = Math.ceil(filteredUsers.length / usersPerPage)

useEffect(() => {
  setCurrentPage(1)
}, [userSearch, roleFilter])
    

    // 📝 Filtered Complaints
    const filteredComplaints = complaints.filter((c) => {
      return (
        (c.title || c.description || "")
          .toLowerCase()
          .includes(complaintSearch.toLowerCase()) &&
        (statusFilter ? c.status === statusFilter : true) &&
        (priorityFilter ? c.priority === priorityFilter : true)
      )
    })
    // 🔥 PAGINATION FOR COMPLAINTS
    const indexOfLastComplaint = complaintPage * complaintsPerPage
    const indexOfFirstComplaint = indexOfLastComplaint - complaintsPerPage

    const paginatedComplaints = filteredComplaints.slice(
      indexOfFirstComplaint,
      indexOfLastComplaint
    )

    const totalComplaintPages = Math.ceil(
      filteredComplaints.length / complaintsPerPage
    )

    useEffect(() => {
  setComplaintPage(1)
}, [complaintSearch, statusFilter, priorityFilter])
    const handleCreateAdmin = async (e) => {
  e.preventDefault()

  if (!newAdmin.name || !newAdmin.email || !newAdmin.password || !newAdmin.departmentId) {
    showMessage("error", "All fields are required")
    return
  }

  try {
    setActionLoading(true)
    await API.post("/superadmin/create-admin", newAdmin)
    showMessage("success", "Department Admin created successfully")

    setNewAdmin({
      name: "",
      email: "",
      password: "",
      departmentId: ""
    })

    fetchData()
  } catch (error) {
    showMessage("error", error.response?.data || "Failed to create admin")
  } finally {
    setActionLoading(false)
  }
}
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="bg-gray-800/50 backdrop-blur-xl border-b border-gray-700/50 px-6 py-4">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-amber-500/20 rounded-xl flex items-center justify-center text-xl">
              👑
            </div>
            <h1 className="text-2xl font-bold text-white">Super Admin Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-400">Welcome, {user?.name}</span>
            <span className="px-3 py-1 bg-amber-500/20 text-amber-400 rounded-full text-sm font-medium border border-amber-500/30">
              SUPER_ADMIN
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-xl text-sm font-medium transition-colors"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Message Toast */}
      {message.text && (
        <div className={`fixed top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-lg ${
          message.type === "error" ? "bg-red-500/90 text-white" : "bg-green-500/90 text-white"
        }`}>
          {message.text}
        </div>
      )}

      <div className="max-w-7xl mx-auto p-6 flex gap-6">
        {/* Sidebar */}
        <aside className="w-64 flex-shrink-0">
          <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-4 sticky top-6">
            <nav className="space-y-2">
              <button
                onClick={() => setActiveSection("overview")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activeSection === "overview"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                📊 Overview
              </button>
              <button
                onClick={() => setActiveSection("users")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activeSection === "users"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                👥 Manage Users
              </button>
              <button
                onClick={() => setActiveSection("departments")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activeSection === "departments"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                🏢 Manage Departments
              </button>
              <button
                onClick={() => setActiveSection("complaints")}
                className={`w-full text-left px-4 py-3 rounded-xl transition-all ${
                  activeSection === "complaints"
                    ? "bg-amber-500/20 text-amber-400 border border-amber-500/30"
                    : "text-gray-400 hover:bg-gray-700/50 hover:text-white"
                }`}
              >
                📝 View All Complaints
              </button>
            </nav>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1">
          {activeSection === "overview" && (
            <div className="space-y-6">
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-2xl font-bold text-white mb-2">
                  Welcome Super Admin 👑
                </h2>
                <p className="text-gray-400">
                  Manage your city's civic complaint system from this control panel.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Users</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {loading ? "..." : stats.users}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-blue-500/20 rounded-xl flex items-center justify-center text-2xl">
                      👥
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Departments</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {loading ? "..." : stats.departments}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-green-500/20 rounded-xl flex items-center justify-center text-2xl">
                      🏢
                    </div>
                  </div>
                </div>

                <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-amber-500/30 transition-all">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-gray-400 text-sm">Total Complaints</p>
                      <p className="text-3xl font-bold text-white mt-1">
                        {loading ? "..." : stats.complaints}
                      </p>
                    </div>
                    <div className="w-14 h-14 bg-purple-500/20 rounded-xl flex items-center justify-center text-2xl">
                      📝
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeSection === "users" && (
  <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
    
    <h2 className="text-xl font-bold text-white mb-4">Manage Users</h2>

    {/* 🔥 CREATE ADMIN FORM (MOVE HERE) */}
    <div className="mb-6 bg-gray-700/30 p-4 rounded-xl">
      <h3 className="text-white font-semibold mb-3">Create Department Admin</h3>

      <form onSubmit={handleCreateAdmin} className="grid grid-cols-1 md:grid-cols-4 gap-3">
        
        <input
          type="text"
          placeholder="Name"
          value={newAdmin.name}
          onChange={(e) => setNewAdmin({ ...newAdmin, name: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
        />

        <input
          type="email"
          placeholder="Email"
          value={newAdmin.email}
          onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
        />

        <input
          type="password"
          placeholder="Password"
          value={newAdmin.password}
          onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
        />

        <select
          value={newAdmin.departmentId}
          onChange={(e) => setNewAdmin({ ...newAdmin, departmentId: e.target.value })}
          className="px-3 py-2 bg-gray-800 border border-gray-600 rounded-lg text-white"
        >
          <option value="">Select Department</option>
          {departments.map((dept) => (
            <option key={dept.id} value={dept.id}>
              {dept.name}
            </option>
          ))}
        </select>

        <button
          type="submit"
          disabled={actionLoading}
          className="col-span-1 md:col-span-4 px-4 py-2 bg-amber-500 text-black rounded-lg hover:bg-amber-400"
        >
          {actionLoading ? "Creating..." : "Create Admin"}
        </button>
      </form>
    </div>

    {/* 🔍 SEARCH + FILTER */}
    <div className="flex gap-4 mb-4">
      <input
        type="text"
        placeholder="Search users..."
        value={userSearch}
        onChange={(e) => setUserSearch(e.target.value)}
        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white"
      />

      <select
        value={roleFilter}
        onChange={(e) => setRoleFilter(e.target.value)}
        className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white"
      >
        <option value="">All Roles</option>
        <option value="USER">User</option>
        <option value="DEPARTMENT_ADMIN">Dept Admin</option>
        <option value="SUPER_ADMIN">Super Admin</option>
      </select>
    </div>

    {/* TABLE */}
    {loading ? (
      <p className="text-gray-400">Loading...</p>
    ) : (
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="pb-3 text-gray-400 font-medium">ID</th>
              <th className="pb-3 text-gray-400 font-medium">Name</th>
              <th className="pb-3 text-gray-400 font-medium">Email</th>
              <th className="pb-3 text-gray-400 font-medium">Role</th>
              <th className="pb-3 text-gray-400 font-medium">Actions</th>
            </tr>
          </thead>

          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                <td className="py-3 text-white">{u.id}</td>
                <td className="py-3 text-white">{u.name}</td>
                <td className="py-3 text-gray-300">{u.email}</td>

                <td className="py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    u.role === "SUPER_ADMIN" ? "bg-purple-500/20 text-purple-400" :
                    u.role === "DEPARTMENT_ADMIN" ? "bg-blue-500/20 text-blue-400" :
                    "bg-gray-500/20 text-gray-400"
                  }`}>
                    {u.role}
                  </span>
                </td>

                <td className="py-3">
                  <div className="flex gap-2">
                    {u.role !== "SUPER_ADMIN" ? (
                      <button
                        onClick={() => handleDeleteUser(u.id)}
                        disabled={actionLoading}
                        className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg text-sm transition-colors"
                      >
                        Delete
                      </button>
                    ) : (
                      <span className="text-gray-500 text-sm">Protected</span>
                    )}
                </div>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4 text-white">
  
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
  >
    ⬅ Prev
  </button>

  <span className="text-gray-300">
    Page {currentPage} of {totalPages}
  </span>

  <button
    onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
    disabled={currentPage === totalPages}
    className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
  >
    Next ➡
  </button>

</div>
      </div>
    )}
  </div>
)}
          {activeSection === "departments" && (
            <div className="space-y-6">
              {/* Create Department Form */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">Create New Department</h2>
                <form onSubmit={handleCreateDepartment} className="flex gap-4">
                  <input
                    type="text"
                    placeholder="Department Name"
                    value={newDepartment.name}
                    onChange={(e) => setNewDepartment({ ...newDepartment, name: e.target.value })}
                    className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={newDepartment.description}
                    onChange={(e) => setNewDepartment({ ...newDepartment, description: e.target.value })}
                    className="flex-1 px-4 py-2 bg-gray-700/50 border border-gray-600 rounded-xl text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <button
                    type="submit"
                    disabled={actionLoading}
                    className="px-6 py-2 bg-amber-500 text-gray-900 font-medium rounded-xl hover:bg-amber-400 transition-colors disabled:opacity-50"
                  >
                    {actionLoading ? "Creating..." : "Create"}
                  </button>
                </form>
              </div>

              {/* Departments List */}
              <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
                <h2 className="text-xl font-bold text-white mb-4">All Departments</h2>
                
                {loading ? (
                  <p className="text-gray-400">Loading...</p>
                ) : (
                  <div className="grid gap-4">
                    {departments.map((dept) => (
                      <div key={dept.id} className="flex items-center justify-between bg-gray-700/30 rounded-xl p-4">
                        <div>
                          <h3 className="text-white font-medium">{dept.name}</h3>
                          <p className="text-gray-400 text-sm">{dept.description || "No description"}</p>
                        </div>
                        <button
                          onClick={() => handleDeleteDepartment(dept.id)}
                          disabled={actionLoading}
                          className="px-4 py-2 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg text-sm transition-colors"
                        >
                          Delete
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {activeSection === "complaints" && (
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6">
              <h2 className="text-xl font-bold text-white mb-4">All Complaints</h2>
              
              {loading ? (
                <p className="text-gray-400">Loading...</p>
              ) : (
                <div className="overflow-x-auto">
                  <div className="flex gap-4 mb-4 flex-wrap">
                    <input
                      type="text"
                      placeholder="Search complaints..."
                      value={complaintSearch}
                      onChange={(e) => setComplaintSearch(e.target.value)}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    />

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    >
                      <option value="">All Status</option>
                      <option value="NEW">New</option>
                      <option value="IN_PROGRESS">In Progress</option>
                      <option value="RESOLVED">Resolved</option>
                    </select>

                    <select
                      value={priorityFilter}
                      onChange={(e) => setPriorityFilter(e.target.value)}
                      className="px-4 py-2 bg-gray-700 border border-gray-600 rounded-xl text-white"
                    >
                      <option value="">All Priority</option>
                      <option value="HIGH">High</option>
                      <option value="MEDIUM">Medium</option>
                      <option value="LOW">Low</option>
                    </select>
                  </div>
                  <table className="w-full text-left">
                    <thead>
                      <tr className="border-b border-gray-700">
                        <th className="pb-3 text-gray-400 font-medium">ID</th>
                        <th className="pb-3 text-gray-400 font-medium">Title</th>
                        <th className="pb-3 text-gray-400 font-medium">Category</th>
                        <th className="pb-3 text-gray-400 font-medium">Status</th>
                        <th className="pb-3 text-gray-400 font-medium">Priority</th>
                        <th className="pb-3 text-gray-400 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {paginatedComplaints.map((c) => (
                        <tr key={c.id} className="border-b border-gray-700/50 hover:bg-gray-700/20">
                          <td className="py-3 text-white">{c.id}</td>
                          <td className="py-3 text-white max-w-xs truncate">{c.title || c.description}</td>
                          <td className="py-3 text-gray-300">{c.category}</td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.status === "NEW" ? "bg-blue-500/20 text-blue-400" :
                              c.status === "IN_PROGRESS" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-green-500/20 text-green-400"
                            }`}>
                              {c.status}
                            </span>
                          </td>
                          <td className="py-3">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              c.priority === "HIGH" ? "bg-red-500/20 text-red-400" :
                              c.priority === "MEDIUM" ? "bg-yellow-500/20 text-yellow-400" :
                              "bg-green-500/20 text-green-400"
                            }`}>
                              {c.priority}
                            </span>
                          </td>
                          <td className="py-3">
                            <button
                              onClick={() => handleDeleteComplaint(c.id)}
                              disabled={actionLoading}
                              className="px-3 py-1 bg-red-500/20 text-red-400 hover:bg-red-500/40 rounded-lg text-sm transition-colors"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  <p className="text-gray-400 text-sm mb-2">
  Showing {indexOfFirstComplaint + 1}–
  {Math.min(indexOfLastComplaint, filteredComplaints.length)} of{" "}
  {filteredComplaints.length} complaints
</p>
                  <div className="flex justify-between items-center mt-4 text-white">
                    
                    <button
                      onClick={() => setComplaintPage((prev) => Math.max(prev - 1, 1))}
                      disabled={complaintPage === 1}
                      className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
                    >
                      ⬅ Prev
                    </button>

                    <span className="text-gray-300">
                      Page {complaintPage} of {totalComplaintPages}
                    </span>

                    <button
                      onClick={() =>
                        setComplaintPage((prev) => Math.min(prev + 1, totalComplaintPages))
                      }
                      disabled={complaintPage === totalComplaintPages}
                      className="px-4 py-2 bg-gray-700 rounded-lg disabled:opacity-50"
                    >
                      Next ➡
                    </button>

                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default SuperAdminDashboard

