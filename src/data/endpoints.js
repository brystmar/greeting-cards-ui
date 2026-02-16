const BASE_URL = import.meta.env.VITE_BACKEND_URL

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
