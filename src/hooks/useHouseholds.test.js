import { renderHook, waitFor } from "@testing-library/react"
import useHouseholds from "./useHouseholds"
import { fetchHouseholdsAndAddresses } from "../services/householdsService"

vi.mock("../services/householdsService")

const mockHousehold = (id, nickname = "Test HH") => ({
    id,
    nickname,
    first_names: "Jane",
    surname: "Doe",
    address_to: "",
    formal_name: "",
    relationship: "",
    relationship_type: "",
    family_side: "",
    known_from: "",
    kids: "",
    pets: "",
    should_receive_holiday_card: true,
    is_relevant: true,
    notes: "",
    created_date: "2024-01-01",
    last_modified: "2024-01-01",
})

const mockAddress = (id, householdId) => ({
    id,
    household_id: householdId,
    line_1: "123 Main St",
    line_2: "",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "United States",
    full_address: "123 Main St, Anytown CA 12345",
    is_current: true,
    is_likely_to_change: false,
    mail_the_card_to_this_address: true,
    notes: "",
})

afterEach(() => {
    vi.clearAllMocks()
})

describe("useHouseholds", () => {
    it("starts in a loading state", () => {
        fetchHouseholdsAndAddresses.mockImplementation(() => new Promise(() => {}))
        const { result } = renderHook(() => useHouseholds())
        expect(result.current.isLoading).toBe(true)
    })

    it("populates householdData and addressData on successful fetch", async () => {
        fetchHouseholdsAndAddresses.mockResolvedValue({
            households: [mockHousehold(1, "Smith Family")],
            addresses: [mockAddress(10, 1)],
        })
        const { result } = renderHook(() => useHouseholds())
        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.householdData).toHaveLength(1)
        expect(result.current.householdData[0].nickname).toBe("Smith Family")
        expect(result.current.addressData).toHaveLength(1)
        expect(result.current.error).toBeNull()
    })

    it("sets error state when fetch fails", async () => {
        fetchHouseholdsAndAddresses.mockRejectedValue(new Error("Network error"))
        const { result } = renderHook(() => useHouseholds())
        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.error).toContain("Network error")
    })

    it("sets isLoading to false after a failed fetch", async () => {
        fetchHouseholdsAndAddresses.mockRejectedValue(new Error("fail"))
        const { result } = renderHook(() => useHouseholds())
        await waitFor(() => expect(result.current.isLoading).toBe(false))
    })

    it("computes nextHouseholdId as one more than the max household id", async () => {
        fetchHouseholdsAndAddresses.mockResolvedValue({
            households: [mockHousehold(3), mockHousehold(7), mockHousehold(5)],
            addresses: [],
        })
        const { result } = renderHook(() => useHouseholds())
        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.nextIds.nextHouseholdId).toBe(8)
    })

    it("computes nextAddressId as one more than the max address id", async () => {
        fetchHouseholdsAndAddresses.mockResolvedValue({
            households: [mockHousehold(1)],
            addresses: [mockAddress(10, 1), mockAddress(4, 1)],
        })
        const { result } = renderHook(() => useHouseholds())
        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.nextIds.nextAddressId).toBe(11)
    })

    it("hhIndex is null when no households are loaded", async () => {
        fetchHouseholdsAndAddresses.mockResolvedValue({ households: [], addresses: [] })
        const { result } = renderHook(() => useHouseholds())
        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.hhIndex).toBeNull()
    })

    it("hhIndex is a searchable Fuse instance when households are loaded", async () => {
        fetchHouseholdsAndAddresses.mockResolvedValue({
            households: [mockHousehold(1, "Smith Family")],
            addresses: [],
        })
        const { result } = renderHook(() => useHouseholds())
        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.hhIndex).not.toBeNull()
        const results = result.current.hhIndex.search("Smith")
        expect(results).toHaveLength(1)
        expect(results[0].item.nickname).toBe("Smith Family")
    })

    it("auto-selects the first household when data loads for the first time", async () => {
        fetchHouseholdsAndAddresses.mockResolvedValue({
            households: [mockHousehold(42, "First HH"), mockHousehold(99, "Second HH")],
            addresses: [],
        })
        const { result } = renderHook(() => useHouseholds())
        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(result.current.selectedHH).toBe(42)
    })

    it("exposes a refresh function that re-fetches data", async () => {
        fetchHouseholdsAndAddresses.mockResolvedValue({ households: [], addresses: [] })
        const { result } = renderHook(() => useHouseholds())
        await waitFor(() => expect(result.current.isLoading).toBe(false))

        expect(fetchHouseholdsAndAddresses).toHaveBeenCalledTimes(1)

        await waitFor(() => result.current.refresh())

        expect(fetchHouseholdsAndAddresses).toHaveBeenCalledTimes(2)
    })
})
