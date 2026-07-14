const PROD_API = "http://civi-project-backend-lxygh6-8d9b6a-51-79-138-201.traefik.me"
const LOCAL_API = "http://localhost:8080"

const API_ORIGIN = (
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? LOCAL_API : PROD_API)
).replace(/\/$/, "")

export const API_BASE_URL = `${API_ORIGIN}/api`
export const IMAGE_BASE_URL = `${API_ORIGIN}/`
