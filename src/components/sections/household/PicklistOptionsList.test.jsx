import { render, screen } from "@testing-library/react"
import PicklistOptionsList from "./PicklistOptionsList"

const households = [
    { id: 3, nickname: "Zebra Family", first_names: "Zara", surname: "Zebra" },
    { id: 1, nickname: "Apple Family", first_names: "Ann", surname: "Apple" },
    { id: 2, nickname: "Mango Family", first_names: "Mike", surname: "Mango" },
]

describe("PicklistOptionsList", () => {
    it("renders an option for each household", () => {
        render(<select><PicklistOptionsList elementList={households} /></select>)
        expect(screen.getAllByRole("option")).toHaveLength(3)
    })

    it("sorts options alphabetically by nickname", () => {
        render(<select><PicklistOptionsList elementList={households} /></select>)
        const options = screen.getAllByRole("option")
        expect(options[0].textContent).toBe("Apple Family")
        expect(options[1].textContent).toBe("Mango Family")
        expect(options[2].textContent).toBe("Zebra Family")
    })

    it("sorts case-insensitively", () => {
        const mixed = [
            { id: 1, nickname: "zoo Family", first_names: "", surname: "" },
            { id: 2, nickname: "Apple Family", first_names: "", surname: "" },
        ]
        render(<select><PicklistOptionsList elementList={mixed} /></select>)
        const options = screen.getAllByRole("option")
        expect(options[0].textContent).toBe("Apple Family")
        expect(options[1].textContent).toBe("zoo Family")
    })

    it("renders nothing when elementList is empty", () => {
        render(<select><PicklistOptionsList elementList={[]} /></select>)
        expect(screen.queryAllByRole("option")).toHaveLength(0)
    })

    it("does not mutate the original list when sorting", () => {
        const original = [...households]
        render(<select><PicklistOptionsList elementList={households} /></select>)
        expect(households.map((h) => h.id)).toEqual(original.map((h) => h.id))
    })
})
