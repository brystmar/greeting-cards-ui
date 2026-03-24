import { fetchHouseholdsAndAddresses } from "./householdsService"

const rawAddress = {
    id: 1,
    household_id: 1,
    line_1: "123 Main St",
    line_2: null,
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "US",
    full_address: "123 Main St, Anytown, CA 12345",
    is_current: 1,
    is_likely_to_change: null,
    mail_the_card_to_this_address: null,
    notes: null,
}

const rawHousehold = {
    id: 1,
    nickname: "Smith Family",
    first_names: "John",
    surname: "Smith",
    address_to: null,
    formal_name: null,
    relationship: null,
    relationship_type: null,
    family_side: null,
    known_from: null,
    kids: null,
    pets: null,
    should_receive_holiday_card: 1,
    is_relevant: null,
    notes: null,
}

let fetchMock

beforeEach(() => {
    fetchMock = vi.fn()
    vi.stubGlobal("fetch", fetchMock)
})

afterEach(() => {
    vi.unstubAllGlobals()
})

function mockFetchSuccess(addresses = [rawAddress], households = [rawHousehold]) {
    fetchMock
        .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue(addresses) })
        .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue(households) })
}

describe("fetchHouseholdsAndAddresses", () => {
    it("returns normalized households and addresses on success", async () => {
        mockFetchSuccess()
        const { addresses, households } = await fetchHouseholdsAndAddresses()
        expect(addresses).toHaveLength(1)
        expect(households).toHaveLength(1)
    })

    it("normalizes null string fields on addresses to empty string", async () => {
        mockFetchSuccess()
        const { addresses } = await fetchHouseholdsAndAddresses()
        expect(addresses[0].line_2).toBe("")
        expect(addresses[0].notes).toBe("")
    })

    it("normalizes null boolean fields on addresses to false", async () => {
        mockFetchSuccess()
        const { addresses } = await fetchHouseholdsAndAddresses()
        expect(addresses[0].is_likely_to_change).toBe(false)
        expect(addresses[0].mail_the_card_to_this_address).toBe(false)
    })

    it("normalizes truthy numeric boolean fields on addresses to true", async () => {
        mockFetchSuccess()
        const { addresses } = await fetchHouseholdsAndAddresses()
        expect(addresses[0].is_current).toBe(true)
    })

    it("normalizes null string fields on households to empty string", async () => {
        mockFetchSuccess()
        const { households } = await fetchHouseholdsAndAddresses()
        expect(households[0].address_to).toBe("")
        expect(households[0].notes).toBe("")
        expect(households[0].kids).toBe("")
        expect(households[0].pets).toBe("")
    })

    it("normalizes null boolean fields on households to false", async () => {
        mockFetchSuccess()
        const { households } = await fetchHouseholdsAndAddresses()
        expect(households[0].is_relevant).toBe(false)
    })

    it("normalizes truthy numeric boolean fields on households to true", async () => {
        mockFetchSuccess()
        const { households } = await fetchHouseholdsAndAddresses()
        expect(households[0].should_receive_holiday_card).toBe(true)
    })

    it("throws when the addresses response is not ok", async () => {
        fetchMock
            .mockResolvedValueOnce({ ok: false, status: 500 })
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue([]) })
        await expect(fetchHouseholdsAndAddresses()).rejects.toThrow("500")
    })

    it("throws when the households response is not ok", async () => {
        fetchMock
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue([]) })
            .mockResolvedValueOnce({ ok: false, status: 404 })
        await expect(fetchHouseholdsAndAddresses()).rejects.toThrow("404")
    })

    it("returns empty arrays when the API returns a non-array for addresses", async () => {
        fetchMock
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue(null) })
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue([rawHousehold]) })
        const { addresses } = await fetchHouseholdsAndAddresses()
        expect(addresses).toEqual([])
    })

    it("returns empty arrays when the API returns a non-array for households", async () => {
        fetchMock
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue([rawAddress]) })
            .mockResolvedValueOnce({ ok: true, json: vi.fn().mockResolvedValue(null) })
        const { households } = await fetchHouseholdsAndAddresses()
        expect(households).toEqual([])
    })
})
