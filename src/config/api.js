// API Configuration
// Automatically detects localhost vs production

const getApiUrl = () => {
  const isLocalhost = ["localhost", "127.0.0.1"].includes(window.location.hostname)
  const envUrl =
    typeof import.meta !== "undefined" &&
    import.meta.env &&
    import.meta.env.VITE_API_URL &&
    String(import.meta.env.VITE_API_URL)

  if (envUrl && /^https?:\/\//.test(envUrl)) {
    return envUrl
  }

  if (isLocalhost) {
    return envUrl || "http://localhost:5000"
  }

  // Default production API
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
