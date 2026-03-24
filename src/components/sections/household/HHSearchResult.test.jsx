import { render, screen } from "@testing-library/react"
import HouseholdSearchResult from "./HHSearchResult"

const defaultProps = {
    nickname: "Smith Family",
    first_names: "John",
    surname: "Smith",
    kids: "",
    pets: "",
    known_from: "Work",
    relationship: "Friend",
    relationship_type: "Personal",
    matches: [],
}

describe("HouseholdSearchResult", () => {
    it("renders the nickname", () => {
        render(<HouseholdSearchResult {...defaultProps} />)
        expect(screen.getByText("Smith Family")).toBeInTheDocument()
    })

    it("renders first_names and surname", () => {
        render(<HouseholdSearchResult {...defaultProps} />)
        expect(screen.getByText("John")).toBeInTheDocument()
        expect(screen.getByText("Smith")).toBeInTheDocument()
    })

    it("renders the known_from field", () => {
        render(<HouseholdSearchResult {...defaultProps} />)
        expect(screen.getByText("Work")).toBeInTheDocument()
    })

    it("renders relationship info when both relationship_type and relationship are present", () => {
        render(<HouseholdSearchResult {...defaultProps} />)
        expect(screen.getByText("Personal >> Friend")).toBeInTheDocument()
    })

    it("renders only relationship when relationship_type is empty", () => {
        render(<HouseholdSearchResult {...defaultProps} relationship_type="" />)
        expect(screen.getByText("Friend")).toBeInTheDocument()
    })

    it("does not show kids label when kids is empty", () => {
        render(<HouseholdSearchResult {...defaultProps} kids="" />)
        expect(screen.queryByText("Kids:")).not.toBeInTheDocument()
    })

    it("shows kids label and value when kids is non-empty", () => {
        render(<HouseholdSearchResult {...defaultProps} kids="Tommy, Sarah" />)
        expect(screen.getByText("Kids:")).toBeInTheDocument()
        expect(screen.getByText("Tommy, Sarah")).toBeInTheDocument()
    })

    it("does not show pets label when pets is empty", () => {
        render(<HouseholdSearchResult {...defaultProps} pets="" />)
        expect(screen.queryByText("Pets:")).not.toBeInTheDocument()
    })

    it("shows pets label and value when pets is non-empty", () => {
        render(<HouseholdSearchResult {...defaultProps} pets="Rex" />)
        expect(screen.getByText("Pets:")).toBeInTheDocument()
        expect(screen.getByText("Rex")).toBeInTheDocument()
    })

    it("wraps matched characters in a <mark> element", () => {
        const matches = [
            {
                key: "nickname",
                indices: [[0, 4]],  // highlights "Smith" (indices 0–4)
            },
        ]
        render(<HouseholdSearchResult {...defaultProps} matches={matches} />)
        const mark = document.querySelector("mark")
        expect(mark).toBeInTheDocument()
        expect(mark.textContent).toBe("Smith")
    })

    it("renders without crashing when matches is undefined", () => {
        render(<HouseholdSearchResult {...defaultProps} matches={undefined} />)
        expect(screen.getByText("Smith Family")).toBeInTheDocument()
    })
})
