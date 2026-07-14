import { useState, useEffect, useRef } from "react"
import { Link, useNavigate } from "react-router-dom"
import API from "../../services/api"

// Format relative time
const formatTime = (dateString) => {
  if (!dateString) return ""
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return "Just now"
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`
  return date.toLocaleDateString()
}

// Get icon based on notification type
const getTypeIcon = (type) => {
  switch (type) {
    case "STATUS_UPDATE":
      return "📋"
    case "REMARK":
      return "💬"
    case "NEW_COMPLAINT":
      return "📢"
    default:
      return "🔔"
  }
}

function NotificationDropdown({ 
  user, 
  theme = "blue", // "blue" for department, "emerald" for user
  viewAllLink = "/notifications",
  notificationsApi = "/notifications/my"
}) {
  const [isOpen, setIsOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(false)
  const dropdownRef = useRef(null)
  const navigate = useNavigate()

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      console.log("Fetching notifications from:", notificationsApi)
      const res = await API.get(notificationsApi)
      console.log("Notifications response:", res.data)
      // Backend returns isRead as 'read' in JSON
      setNotifications(res.data.reverse())
    } catch (err) {
      console.error("Failed to fetch notifications:", err)
    } finally {
      setLoading(false)
    }
  }

  // Fetch notifications every time dropdown opens
  useEffect(() => {
    console.log("isOpen:", isOpen, "user?.id:", user?.id)
    if (isOpen && user?.id) {
      fetchNotifications()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, user?.id])

  const markAsRead = async (notification) => {
    if (notification.read) return
    
    try {
      await API.put(`/notifications/${notification.id}/read`)
      setNotifications(notifications.map(n => 
        n.id === notification.id ? { ...n, read: true } : n
      ))
    } catch (err) {
      console.error("Failed to mark as read:", err)
    }
  }

  const handleNotificationClick = (notification) => {
    markAsRead(notification)
    setIsOpen(false)
    if (notification.complaintId) {
      navigate(`/complaint/${notification.complaintId}`)
    }
  }

  // Filter to show only unread notifications
  const unreadNotifications = notifications.filter(n => !n.read)
  const unreadCount = unreadNotifications.length

  // Theme colors
  const themeColors = {
    blue: {
      header: "from-blue-500 to-blue-600",
      badge: "bg-blue-100 text-blue-600 hover:bg-blue-50",
      indicator: "bg-blue-500",
      iconBg: notification => notification.read ? "bg-gray-100" : "bg-blue-500",
      iconColor: notification => notification.read ? "text-gray-400" : "text-white"
    },
    emerald: {
      header: "from-emerald-500 to-emerald-600",
      badge: "bg-emerald-100 text-emerald-600 hover:bg-emerald-50",
      indicator: "bg-emerald-500",
      iconBg: notification => notification.read ? "bg-gray-100" : "bg-emerald-500",
      iconColor: notification => notification.read ? "text-gray-400" : "text-white"
    }
  }

  const colors = themeColors[theme] || themeColors.blue

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Icon Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`relative p-2 transition-colors rounded-xl ${
          isOpen ? colors.badge : "text-gray-600 hover:bg-gray-50"
        }`}
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-red-500 rounded-full text-white text-xs font-bold flex items-center justify-center animate-pulse">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-2xl shadow-2xl border border-gray-100 overflow-hidden z-50 animate-in fade-in slide-in-from-top-2 duration-200">
          {/* Header */}
          <div className={`px-4 py-3 bg-gradient-to-r ${colors.header} text-white`}>
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs bg-white/20 px-2 py-1 rounded-full">
                  {unreadCount} new
                </span>
              )}
            </div>
          </div>

          {/* Notifications List - Show only unread */}
          <div className="max-h-80 overflow-y-auto">
            {loading ? (
              <div className="p-8 text-center">
                <div className={`animate-spin rounded-full h-8 w-8 border-b-2 ${theme === "emerald" ? "border-emerald-500" : "border-blue-500"} mx-auto`}></div>
                <p className="text-gray-500 text-sm mt-2">Loading...</p>
              </div>
            ) : unreadNotifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-4xl mb-2">🔔</div>
                <p className="text-gray-500 text-sm">No unread notifications</p>
                <p className="text-gray-400 text-xs">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-50">
                {unreadNotifications.slice(0, 7).map((notification) => (
                  <div
                    key={notification.id}
                    onClick={() => handleNotificationClick(notification)}
                    className={`px-4 py-3 hover:bg-gray-50 transition-colors cursor-pointer bg-blue-50/30`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 bg-blue-500">
                        <span className="text-sm text-white">
                          {getTypeIcon(notification.type)}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800 font-medium">
                          {notification.message}
                        </p>
                        <p className="text-xs text-gray-400 mt-1">
                          {formatTime(notification.createdAt)}
                        </p>
                      </div>
                      <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {viewAllLink && (
            <div className="px-4 py-3 bg-gray-50 border-t border-gray-100">
              <Link
                to={viewAllLink}
                onClick={() => setIsOpen(false)}
                className={`block text-center text-sm font-medium hover:underline transition-colors ${
                  theme === "emerald" 
                    ? "text-emerald-600 hover:text-emerald-700" 
                    : "text-blue-600 hover:text-blue-700"
                }`}
              >
                View All Notifications →
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default NotificationDropdown
