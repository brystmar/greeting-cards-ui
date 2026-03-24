import { render, screen } from "@testing-library/react"
import { MemoryRouter } from "react-router"
import NavBar from "./NavBar"

function renderNavBar(initialPath = "/") {
    return render(
        <MemoryRouter initialEntries={[initialPath]}>
            <NavBar />
        </MemoryRouter>
    )
}

describe("NavBar", () => {
    it("renders a navigation element", () => {
        renderNavBar()
        expect(screen.getByRole("navigation")).toBeInTheDocument()
    })

    it("renders a link to /households", () => {
        renderNavBar()
        const link = screen.getByRole("link", { name: "Households" })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute("href", "/households")
    })

    it("renders a link to /cards", () => {
        renderNavBar()
        const link = screen.getByRole("link", { name: "Cards & Events" })
        expect(link).toBeInTheDocument()
        expect(link).toHaveAttribute("href", "/cards")
    })

    it("applies the active class to the Households link when on /households", () => {
        renderNavBar("/households")
        const link = screen.getByRole("link", { name: "Households" })
        expect(link.className).toContain("selected-tab")
    })

    it("does not apply the active class to Cards & Events when on /households", () => {
        renderNavBar("/households")
        const link = screen.getByRole("link", { name: "Cards & Events" })
        expect(link.className).not.toContain("selected-tab")
    })
})
