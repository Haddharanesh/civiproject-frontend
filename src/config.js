const PROD_API = "http://civi-project-backend-lxygh6-8d9b6a-51-79-138-201.traefik.me"
const LOCAL_API = "http://localhost:8080"

function resolveApiOrigin() {
  const fromEnv = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "")
  if (import.meta.env.DEV) {
    return fromEnv || LOCAL_API
  }
  // Never allow localhost in production builds (Dokploy env mistype)
  if (fromEnv && !fromEnv.includes("localhost")) {
    return fromEnv
  }
  return PROD_API
}

const API_ORIGIN = resolveApiOrigin()

export const API_BASE_URL = `${API_ORIGIN}/api`
export const IMAGE_BASE_URL = `${API_ORIGIN}/`
