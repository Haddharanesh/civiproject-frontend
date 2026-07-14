const API_ORIGIN = (import.meta.env.VITE_API_URL || "http://localhost:8080").replace(/\/$/, "")

export const API_BASE_URL = `${API_ORIGIN}/api`
export const IMAGE_BASE_URL = `${API_ORIGIN}/`
