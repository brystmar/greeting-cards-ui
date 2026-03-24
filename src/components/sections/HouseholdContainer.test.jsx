import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import Fuse from "fuse.js"
import HouseholdContainer from "./HouseholdContainer"

const hh1 = {
    id: 1,
    nickname: "Anderson Family",
    first_names: "Alice",
    surname: "Anderson",
    address_to: "Alice Anderson",
    formal_name: "Ms. Alice Anderson",
    relationship: "Friend",
    relationship_type: "Personal",
    family_side: "",
    known_from: "Work",
    kids: "",
    pets: "",
    should_receive_holiday_card: true,
    is_relevant: true,
    notes: "",
    created_date: "2024-01-01",
    last_modified: "2024-01-01",
}

const hh2 = {
    id: 2,
    nickname: "Brown Family",
    first_names: "Bob",
    surname: "Brown",
    address_to: "Bob Brown",
    formal_name: "Mr. Bob Brown",
    relationship: "Neighbor",
    relationship_type: "Personal",
    family_side: "",
    known_from: "School",
    kids: "",
    pets: "Max",
    should_receive_holiday_card: false,
    is_relevant: true,
    notes: "",
    created_date: "2024-01-02",
    last_modified: "2024-01-02",
}

const addr1 = {
    id: 10,
    household_id: 1,
    line_1: "1 Main St",
    line_2: "",
    city: "Anytown",
    state: "CA",
    zip: "12345",
    country: "United States",
    full_address: "1 Main St, Anytown CA 12345",
    is_current: true,
    is_likely_to_change: false,
    mail_the_card_to_this_address: true,
    notes: "",
}

function makeFuseIndex(list) {
    return new Fuse(list, {
        keys: ["nickname", "first_names", "surname", "kids", "pets", "known_from", "relationship", "relationship_type", "family_side"],
        threshold: 0.25,
        minMatchCharLength: 2,
        includeMatches: true,
    })
}

function renderContainer(overrides = {}) {
    const householdList = overrides.householdList ?? [hh1, hh2]
    return render(
        <HouseholdContainer
            householdList={householdList}
            addressList={overrides.addressList ?? [addr1]}
            updateHHData={overrides.updateHHData ?? vi.fn()}
            updateAddressData={overrides.updateAddressData ?? vi.fn()}
            refreshDataFromDB={overrides.refreshDataFromDB ?? vi.fn()}
            hhIndex={overrides.hhIndex ?? makeFuseIndex(householdList)}
            nextIds={overrides.nextIds ?? { nextHouseholdId: 3, nextAddressId: 11 }}
        />
    )
}

beforeEach(() => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue({
        ok: true,
        json: vi.fn().mockResolvedValue(1),
    }))
})

afterEach(() => {
    vi.unstubAllGlobals()
})

describe("HouseholdContainer — layout and headings", () => {
    it("renders the Select Household heading", () => {
        renderContainer()
        expect(screen.getByText("Select Household")).toBeInTheDocument()
    })

    it("renders the Household Info heading", () => {
        renderContainer()
        expect(screen.getByText("Household Info")).toBeInTheDocument()
    })
})

describe("HouseholdContainer — search box visibility", () => {
    it("shows the search box when there are 2 or more households", () => {
        renderContainer({ householdList: [hh1, hh2] })
        expect(screen.getByPlaceholderText(/Search by name/i)).toBeInTheDocument()
    })

    it("hides the search box when there is only 1 household", () => {
        renderContainer({ householdList: [hh1], hhIndex: makeFuseIndex([hh1]) })
        expect(screen.queryByPlaceholderText(/Search by name/i)).not.toBeInTheDocument()
    })
})

describe("HouseholdContainer — picklist", () => {
    it("renders a picklist with all households", () => {
        renderContainer()
        const options = screen.getAllByRole("option")
        // One hidden placeholder option + one per household
        const nicknameOptions = options.filter((o) => o.value !== "")
        expect(nicknameOptions).toHaveLength(2)
    })

    it("picklist options are sorted alphabetically", () => {
        renderContainer()
        const options = screen.getAllByRole("option").filter((o) => o.value !== "")
        expect(options[0].textContent).toBe("Anderson Family")
        expect(options[1].textContent).toBe("Brown Family")
    })
})

describe("HouseholdContainer — Add New Household button", () => {
    it("shows 'Add New Household' button by default", () => {
        renderContainer()
        expect(screen.getByRole("button", { name: "Add New Household" })).toBeInTheDocument()
    })

    it("button text changes to 'Cancel' when clicked", async () => {
        const user = userEvent.setup()
        renderContainer()
        await user.click(screen.getByRole("button", { name: "Add New Household" }))
        expect(screen.getByRole("button", { name: "Cancel" })).toBeInTheDocument()
    })

    it("button text reverts to 'Add New Household' when clicked again", async () => {
        const user = userEvent.setup()
        renderContainer()
        await user.click(screen.getByRole("button", { name: "Add New Household" }))
        await user.click(screen.getByRole("button", { name: "Cancel" }))
        expect(screen.getByRole("button", { name: "Add New Household" })).toBeInTheDocument()
    })

    it("disables the search box and picklist in insert mode", async () => {
        const user = userEvent.setup()
        renderContainer()
        await user.click(screen.getByRole("button", { name: "Add New Household" }))
        expect(screen.getByPlaceholderText(/Search by name/i)).toBeDisabled()
    })

    it("shows the 'Add This Household' save button in insert mode", async () => {
        const user = userEvent.setup()
        renderContainer()
        await user.click(screen.getByRole("button", { name: "Add New Household" }))
        expect(screen.getByRole("button", { name: "Add This Household" })).toBeInTheDocument()
    })
})

describe("HouseholdContainer — debug panel", () => {
    it("debug panel is hidden by default", () => {
        renderContainer()
        const checkbox = screen.getByLabelText("Show debug info")
        expect(checkbox).not.toBeChecked()
    })

    it("checking 'Show debug info' makes the debug panel visible", async () => {
        const user = userEvent.setup()
        renderContainer()
        const checkbox = screen.getByLabelText("Show debug info")
        await user.click(checkbox)
        expect(checkbox).toBeChecked()
    })
})

describe("HouseholdContainer — search interaction", () => {
    it("shows search results when typing a matching query", async () => {
        const user = userEvent.setup()
        renderContainer()
        const searchBox = screen.getByPlaceholderText(/Search by name/i)
        await user.type(searchBox, "And")
        expect(await screen.findByText("Anderson Family")).toBeInTheDocument()
    })

    it("clears search results when the clear button is clicked", async () => {
        const user = userEvent.setup()
        renderContainer()
        const searchBox = screen.getByPlaceholderText(/Search by name/i)
        await user.type(searchBox, "And")
        await screen.findByText("Known From:")  // only present inside search result cards
        const clearButton = screen.getByLabelText("Clear search")
        await user.click(clearButton)
        expect(screen.queryByText("Known From:")).not.toBeInTheDocument()
    })
})
