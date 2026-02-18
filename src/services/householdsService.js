import { api } from "../data/endpoints"

// Local helpers to normalize null strings & bools
const str = (v) => (v == null ? "" : String(v))
const bool = (v, fallback = false) => (v == null ? fallback : Boolean(v))

const normalizeAddress = (a) => ({
    ...a,
    line_1: str(a.line_1),
    line_2: str(a.line_2),
    city: str(a.city),
    state: str(a.state),
    zip: str(a.zip),
    country: str(a.country),
    full_address: str(a.full_address),
    notes: str(a.notes),
    is_current: bool(a.is_current, false),
    is_likely_to_change: bool(a.is_likely_to_change, false),
    mail_the_card_to_this_address: bool(a.mail_the_card_to_this_address, false)
})

const normalizeHousehold = (hh) => ({
    ...hh,
    nickname: str(hh.nickname),
    first_names: str(hh.first_names),
    surname: str(hh.surname),
    address_to: str(hh.address_to),
    formal_name: str(hh.formal_name),
    relationship: str(hh.relationship),
    relationship_type: str(hh.relationship_type),
    family_side: str(hh.family_side),
    known_from: str(hh.known_from),
    kids: str(hh.kids),
    pets: str(hh.pets),
    notes: str(hh.notes),
    should_receive_holiday_card: bool(hh.should_receive_holiday_card, false),
    is_relevant: bool(hh.is_relevant, false)
})

export async function fetchHouseholdsAndAddresses() {
    console.debug(`Calling endpoint: ${api.addresses.all}`)

    const [addressesResp, householdsResp] = await Promise.all([
        fetch(api.addresses.all),
        fetch(api.households.all)
    ])

    if (!addressesResp.ok) {
        throw new Error(`Failed to fetch addresses: ${addressesResp.status}`)
    }

    if (!householdsResp.ok) {
        throw new Error(`Failed to fetch households: ${householdsResp.status}`)
    }

    const addressesRaw = await addressesResp.json()
    const householdsRaw = await householdsResp.json()

    const addresses = Array.isArray(addressesRaw) ? addressesRaw.map(normalizeAddress) : []
    const households = Array.isArray(householdsRaw) ? householdsRaw.map(normalizeHousehold) : []

    return { addresses, households }
}
