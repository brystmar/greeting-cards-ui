import { api } from "../data/endpoints"

export async function fetchHouseholdsAndAddresses() {
    console.debug(`Calling endpoint: ${api.addresses.all}`)

    const [addressesRes, householdsRes] = await Promise.all([
        fetch(api.addresses.all),
        fetch(api.households.all)
    ])

    if (!addressesRes.ok || !householdsRes.ok) {
        throw new Error("Failed to fetch households or addresses")
    }

    return {
        addresses: await addressesRes.json(),
        households: await householdsRes.json()
    }
}
