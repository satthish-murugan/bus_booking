import axios from "axios"

// Configure axios defaults
axios.defaults.baseURL = process.env.NEXT_PUBLIC_API_URL || ""
axios.defaults.timeout = 10000

// Add request interceptor for logging
axios.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to ${config.url}`)
    return config
  },
  (error) => {
    console.error("Request error:", error)
    return Promise.reject(error)
  },
)

// Add response interceptor for error handling
axios.interceptors.response.use(
  (response) => {
    console.log("Response received:", response.status, response.data)
    return response
  },
  (error) => {
    console.error("API Error:", error.response?.data || error.message)
    return Promise.reject(error)
  },
)

export default axios
