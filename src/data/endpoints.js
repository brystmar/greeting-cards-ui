const BASE_URL = import.meta.env.VITE_BACKEND_URL

// Validate this is imported properly at runtime so we don't deploy a broken UI
if (!BASE_URL) {
    throw new Error("VITE_BACKEND_URL_PROD is not defined. Ensure ENVs are properly loaded.")
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
