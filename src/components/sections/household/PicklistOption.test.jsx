import { render, screen } from "@testing-library/react"
import PicklistOption from "./PicklistOption"

function renderInSelect(props) {
    return render(
        <select>
            <PicklistOption {...props} />
        </select>
    )
}

describe("PicklistOption", () => {
    it("renders an option element with the correct label", () => {
        renderInSelect({ id: 1, nickname: "Smith Family" })
        expect(screen.getByRole("option", { name: "Smith Family" })).toBeInTheDocument()
    })

    it("renders with the correct value attribute", () => {
        renderInSelect({ id: 42, nickname: "Jones Family" })
        const option = screen.getByRole("option", { name: "Jones Family" })
        expect(option).toHaveAttribute("value", "42")
    })

    it("renders an empty label when nickname is not provided", () => {
        renderInSelect({ id: 1 })
        const option = screen.getByRole("option")
        expect(option.textContent.trim()).toBe("")
    })
})
