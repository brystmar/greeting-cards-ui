const BASE_URL = import.meta.env.PROD
    ? "http://192.168.1.92:15000"
    : (import.meta.env.VITE_BACKEND_URL || "http://localhost:5001")

// Log the base URL for debugging
if (import.meta.env.DEV) {
    console.log("API BASE URL (dev):", BASE_URL)
} else {
    console.log("API BASE URL (prod):", BASE_URL)
}

export const api = {
    households: {
        one: `${BASE_URL}/api/v1/household`,
        all: `${BASE_URL}/api/v1/all_households`
    },
    addresses: {
        one: `${BASE_URL}/api/v1/address`,
        all: `${BASE_URL}/api/v1/all_addresses`
    }
}