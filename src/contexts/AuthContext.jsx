import { createContext, useState } from "react"

// eslint-disable-next-line react-refresh/only-export-components
export const AuthContext = createContext()

// Role constants
// eslint-disable-next-line react-refresh/only-export-components
export const ROLES = {
  USER: "USER",
  DEPARTMENT_ADMIN: "DEPARTMENT_ADMIN",
  ADMIN: "SUPER_ADMIN"
}

// Role check helpers
// eslint-disable-next-line react-refresh/only-export-components
export const isUser = (user) => user?.role === ROLES.USER
// eslint-disable-next-line react-refresh/only-export-components
export const isDepartmentAdmin = (user) => user?.role === ROLES.DEPARTMENT_ADMIN
// eslint-disable-next-line react-refresh/only-export-components
export const isAdmin = (user) => user?.role === ROLES.ADMIN
// eslint-disable-next-line react-refresh/only-export-components
export const isCitizen = (user) => isUser(user)

export const AuthProvider = ({ children }) => {
  const getStoredUser = () => {
    try {
      const user = localStorage.getItem("user")
      return user && user !== "undefined" ? JSON.parse(user) : null
    } catch {
      return null
    }
  }

  const [user, setUser] = useState(getStoredUser())

  const login = (userData, token) => {
    localStorage.setItem("token", token)
    localStorage.setItem("user", JSON.stringify(userData))
    setUser(userData)
  }

  const logout = () => {
    localStorage.removeItem("token")
    localStorage.removeItem("user")
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, isUser, isDepartmentAdmin, isAdmin, isCitizen, ROLES }}>
      {children}
    </AuthContext.Provider>
  )
}
