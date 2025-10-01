// API Configuration
// Automatically detects localhost vs production

const getApiUrl = () => {
  const hostname = typeof window !== "undefined" ? window.location.hostname : ""
  const isLocalHost = ["localhost", "127.0.0.1"].includes(hostname)

  // Read env once, but don't blindly trust it in production
  const rawEnv =
    typeof import.meta !== "undefined" && import.meta.env && import.meta.env.VITE_API_URL
      ? String(import.meta.env.VITE_API_URL).trim()
      : ""

  const envLooksLocal = /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?/i.test(rawEnv)
  const envLooksAbsolute = /^https?:\/\//i.test(rawEnv)

  // 1) Local development: allow VITE_API_URL (often http://localhost:5000), else default localhost
  if (isLocalHost) {
    const url = rawEnv || "http://localhost:5000"
    console.log("[API Config] Using LOCAL API URL:", url)
    return url
  }

  // 2) Production: only use VITE_API_URL if it's a NON-local absolute URL
  if (envLooksAbsolute && !envLooksLocal) {
    console.log("[API Config] Using PROD override API URL from env:", rawEnv)
    return rawEnv
  }

  if (envLooksLocal) {
    console.warn("[API Config] Ignoring VITE_API_URL because it points to localhost in production:", rawEnv)
  } else if (!rawEnv) {
    console.log("[API Config] No VITE_API_URL provided; using default production API URL.")
  }

  // 3) Default production API
  return "https://server-api-one-psi.vercel.app"
}

export const API_URL = getApiUrl()

// Helper function to build API endpoints
export const buildApiUrl = (endpoint) => {
  const cleanEndpoint = endpoint.startsWith("/") ? endpoint.slice(1) : endpoint
  return `${API_URL}/${cleanEndpoint}`
}

console.log("[API Config] Running on:", window.location.hostname)
console.log(
  "[API Config] Detected environment:",
  window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1"
    ? "Development (localhost)"
    : "Production",
)
console.log("[API Config] API URL:", API_URL)
