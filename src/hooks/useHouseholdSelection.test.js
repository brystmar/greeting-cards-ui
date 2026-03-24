import { renderHook, act } from "@testing-library/react"
import Fuse from "fuse.js"
import useHouseholdSelection from "./useHouseholdSelection"

const hh1 = {
    id: 1,
    nickname: "Anderson Family",
    first_names: "Alice",
    surname: "Anderson",
    kids: "Ben",
    pets: "",
    known_from: "Work",
    relationship: "Friend",
    relationship_type: "Personal",
    family_side: "",
}

const hh2 = {
    id: 2,
    nickname: "Brown Family",
    first_names: "Bob",
    surname: "Brown",
    kids: "",
    pets: "Max",
    known_from: "School",
    relationship: "Acquaintance",
    relationship_type: "Personal",
    family_side: "",
}

const hh3 = {
    id: 3,
    nickname: "Chen Family",
    first_names: "Charlie",
    surname: "Chen",
    kids: "",
    pets: "",
    known_from: "Neighbor",
    relationship: "Neighbor",
    relationship_type: "Personal",
    family_side: "",
}

const addr1 = { id: 10, household_id: 1, line_1: "1 Main St" }
const addr2 = { id: 20, household_id: 2, line_1: "2 Oak Ave" }

const households = [hh1, hh2, hh3]
const addresses = [addr1, addr2]
const nextIds = { nextHouseholdId: 4, nextAddressId: 30 }

function makeIndex(list = households) {
    return new Fuse(list, {
        keys: ["nickname", "first_names", "surname", "kids", "pets", "known_from", "relationship", "relationship_type", "family_side"],
        threshold: 0.25,
        minMatchCharLength: 2,
        includeMatches: true,
    })
}

function renderSelection(overrides = {}) {
    const updateHHData = vi.fn()
    const updateAddressData = vi.fn()
    const refresh = vi.fn()
    const hhIndex = makeIndex()

    const { result } = renderHook(() =>
        useHouseholdSelection(
            overrides.householdList ?? households,
            overrides.addressList ?? addresses,
            overrides.hhIndex ?? hhIndex,
            overrides.nextIds ?? nextIds,
            overrides.updateHHData ?? updateHHData,
            overrides.updateAddressData ?? updateAddressData,
            overrides.refresh ?? refresh,
        )
    )
    return { result, updateHHData, updateAddressData, refresh }
}

describe("useHouseholdSelection — initial state", () => {
    it("starts with no household selected", () => {
        const { result } = renderSelection()
        expect(result.current.selection.householdId).toBeNull()
    })

    it("starts with insertNewHouseholdMode = false", () => {
        const { result } = renderSelection()
        expect(result.current.insertNewHouseholdMode).toBe(false)
    })

    it("starts with empty query", () => {
        const { result } = renderSelection()
        expect(result.current.query).toBe("")
    })

    it("starts with activeIndex = -1", () => {
        const { result } = renderSelection()
        expect(result.current.activeIndex).toBe(-1)
    })

    it("starts with no search results", () => {
        const { result } = renderSelection()
        expect(result.current.searchResults).toHaveLength(0)
    })
})

describe("useHouseholdSelection — picklist options", () => {
    it("returns households sorted alphabetically by nickname", () => {
        const { result } = renderSelection()
        const nicknames = result.current.picklistOptions.map((o) => o.nickname)
        expect(nicknames).toEqual(["Anderson Family", "Brown Family", "Chen Family"])
    })

    it("sorts case-insensitively", () => {
        const mixed = [
            { id: 1, nickname: "Zoo Family" },
            { id: 2, nickname: "apple Family" },
            { id: 3, nickname: "Mango Family" },
        ]
        const { result } = renderHook(() =>
            useHouseholdSelection(mixed, [], makeIndex(mixed), nextIds, vi.fn(), vi.fn(), vi.fn())
        )
        const nicknames = result.current.picklistOptions.map((o) => o.nickname)
        expect(nicknames).toEqual(["apple Family", "Mango Family", "Zoo Family"])
    })
})

describe("useHouseholdSelection — household selection", () => {
    it("handleHouseholdChange updates selection with correct household id", () => {
        const { result } = renderSelection()
        act(() => {
            result.current.handlers.handleHouseholdChange({ target: { value: "1" } })
        })
        expect(result.current.selection.householdId).toBe(1)
    })

    it("handleHouseholdChange with empty string clears the selection", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleHouseholdChange({ target: { value: "1" } }) })
        act(() => { result.current.handlers.handleHouseholdChange({ target: { value: "" } }) })
        expect(result.current.selection.householdId).toBeNull()
    })

    it("handleSearchResultSelectionChange selects a household by id", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleSearchResultSelectionChange(2) })
        expect(result.current.selection.householdId).toBe(2)
    })

    it("handleSearchResultSelectionChange populates addrList with that household's addresses", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleSearchResultSelectionChange(1) })
        expect(result.current.selection.addrList).toHaveLength(1)
        expect(result.current.selection.addrList[0].id).toBe(10)
    })

    it("handleSearchResultSelectionChange(null) clears the selection", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleSearchResultSelectionChange(1) })
        act(() => { result.current.handlers.handleSearchResultSelectionChange(null) })
        expect(result.current.selection.householdId).toBeNull()
    })

    it("selectedHH reflects the currently selected household object", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleSearchResultSelectionChange(2) })
        expect(result.current.selectedHH).toEqual(hh2)
    })
})

describe("useHouseholdSelection — search", () => {
    it("returns no results when query is shorter than 2 characters", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleSearchQueryChange({ target: { value: "A" } }) })
        expect(result.current.searchResults).toHaveLength(0)
    })

    it("returns matching results when query is 2+ characters", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleSearchQueryChange({ target: { value: "And" } }) })
        expect(result.current.searchResults.length).toBeGreaterThan(0)
        expect(result.current.searchResults[0].item.nickname).toBe("Anderson Family")
    })

    it("limits search results to 5", () => {
        const manyHouseholds = Array.from({ length: 10 }, (_, i) => ({
            id: i + 1,
            nickname: `Anderson ${i}`,
            first_names: "",
            surname: "",
            kids: "",
            pets: "",
            known_from: "",
            relationship: "",
            relationship_type: "",
            family_side: "",
        }))
        const idx = makeIndex(manyHouseholds)
        const { result } = renderHook(() =>
            useHouseholdSelection(manyHouseholds, [], idx, nextIds, vi.fn(), vi.fn(), vi.fn())
        )
        act(() => { result.current.handlers.handleSearchQueryChange({ target: { value: "Anderson" } }) })
        expect(result.current.searchResults.length).toBeLessThanOrEqual(5)
    })

    it("clearSearchQuery resets the query and activeIndex", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleSearchQueryChange({ target: { value: "And" } }) })
        act(() => { result.current.handlers.clearSearchQuery() })
        expect(result.current.query).toBe("")
        expect(result.current.activeIndex).toBe(-1)
    })
})

describe("useHouseholdSelection — keyboard navigation", () => {
    function setupWithResults() {
        const { result } = renderSelection()
        // Type enough to get search results for "Anderson"
        act(() => { result.current.handlers.handleSearchQueryChange({ target: { value: "And" } }) })
        return result
    }

    it("ArrowDown increments activeIndex", () => {
        const result = setupWithResults()
        act(() => {
            result.current.handlers.handleKeyboardInput({ key: "ArrowDown", preventDefault: vi.fn() })
        })
        expect(result.current.activeIndex).toBe(0)
    })

    it("ArrowUp from -1 wraps to the last result", () => {
        const result = setupWithResults()
        act(() => {
            result.current.handlers.handleKeyboardInput({ key: "ArrowUp", preventDefault: vi.fn() })
        })
        const lastIndex = result.current.searchResults.length - 1
        expect(result.current.activeIndex).toBe(lastIndex)
    })

    it("ArrowDown wraps from last result back to 0", () => {
        const result = setupWithResults()
        const total = result.current.searchResults.length
        for (let i = 0; i < total; i++) {
            act(() => {
                result.current.handlers.handleKeyboardInput({ key: "ArrowDown", preventDefault: vi.fn() })
            })
        }
        expect(result.current.activeIndex).toBe(0)
    })

    it("Enter with active index selects that household", () => {
        const result = setupWithResults()
        act(() => {
            result.current.handlers.handleKeyboardInput({ key: "ArrowDown", preventDefault: vi.fn() })
        })
        const expectedId = result.current.searchResults[0].item.id
        act(() => {
            result.current.handlers.handleKeyboardInput({ key: "Enter", preventDefault: vi.fn() })
        })
        expect(result.current.selection.householdId).toBe(expectedId)
    })

    it("Escape clears the query and resets activeIndex", () => {
        const result = setupWithResults()
        act(() => {
            result.current.handlers.handleKeyboardInput({ key: "ArrowDown", preventDefault: vi.fn() })
        })
        act(() => {
            result.current.handlers.handleKeyboardInput({ key: "Escape", preventDefault: vi.fn() })
        })
        expect(result.current.query).toBe("")
        expect(result.current.activeIndex).toBe(-1)
    })

    it("keyboard input has no effect when there are no search results", () => {
        const { result } = renderSelection()
        // query is empty so no results
        act(() => {
            result.current.handlers.handleKeyboardInput({ key: "ArrowDown", preventDefault: vi.fn() })
        })
        expect(result.current.activeIndex).toBe(-1)
    })
})

describe("useHouseholdSelection — insert new household mode", () => {
    it("handleNewRecordMode toggles insertNewHouseholdMode on", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleNewRecordMode() })
        expect(result.current.insertNewHouseholdMode).toBe(true)
    })

    it("handleNewRecordMode toggles insertNewHouseholdMode off again", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleNewRecordMode() })
        act(() => { result.current.handlers.handleNewRecordMode() })
        expect(result.current.insertNewHouseholdMode).toBe(false)
    })

    it("handleNewRecordMode accepts an explicit boolean value", () => {
        const { result } = renderSelection()
        act(() => { result.current.handlers.handleNewRecordMode(true) })
        expect(result.current.insertNewHouseholdMode).toBe(true)
        act(() => { result.current.handlers.handleNewRecordMode(false) })
        expect(result.current.insertNewHouseholdMode).toBe(false)
    })
})

describe("useHouseholdSelection — data mutation handlers", () => {
    it("updateOneHousehold replaces the matching household in the list", () => {
        const { result, updateHHData } = renderSelection()
        const updated = { ...hh1, nickname: "Anderson Updated" }
        act(() => { result.current.handlers.updateOneHousehold(updated) })
        const newList = updateHHData.mock.calls[0][0]
        expect(newList.find((h) => h.id === 1).nickname).toBe("Anderson Updated")
        expect(newList).toHaveLength(households.length)
    })

    it("insertNewHousehold appends the new household and creates its address", () => {
        const { result, updateHHData, updateAddressData } = renderSelection()
        const newHH = {
            id: 4,
            nickname: "New HH",
            address_id: 30,
            created_date: "2024-06-01",
            last_modified: "2024-06-01",
        }
        act(() => { result.current.handlers.insertNewHousehold(newHH) })

        const newHHList = updateHHData.mock.calls[0][0]
        expect(newHHList).toHaveLength(households.length + 1)
        expect(newHHList.find((h) => h.id === 4)).toBeDefined()

        const newAddressList = updateAddressData.mock.calls[0][0]
        expect(newAddressList).toHaveLength(addresses.length + 1)
        const createdAddr = newAddressList.find((a) => a.household_id === 4)
        expect(createdAddr).toBeDefined()
        expect(createdAddr.id).toBe(30)
    })
})
