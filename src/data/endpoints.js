export const api = {
    households:  {
        one: `${process.env.REACT_APP_BACKEND_URL}/api/v1/household`,
        all: `${process.env.REACT_APP_BACKEND_URL}/api/v1/all_households`
    },
    addresses: {
        one: `${process.env.REACT_APP_BACKEND_URL}/api/v1/address`,
        all: `${process.env.REACT_APP_BACKEND_URL}/api/v1/all_addresses`
    }
}
