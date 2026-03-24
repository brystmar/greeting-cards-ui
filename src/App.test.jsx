import { render, screen } from "@testing-library/react"
import { createMemoryRouter, RouterProvider } from "react-router"
import App from "./App"

vi.mock("./services/householdsService", () => ({
    fetchHouseholdsAndAddresses: vi.fn().mockResolvedValue({ households: [], addresses: [] })
}))

test("renders the navigation bar", () => {
    const router = createMemoryRouter([{ path: "/", element: <App /> }])
    render(<RouterProvider router={router} />)
    expect(screen.getByRole("navigation")).toBeInTheDocument()
})

test("renders the Households nav link", () => {
    const router = createMemoryRouter([{ path: "/", element: <App /> }])
    render(<RouterProvider router={router} />)
    expect(screen.getByRole("link", { name: "Households" })).toBeInTheDocument()
})

test("renders the Cards & Events nav link", () => {
    const router = createMemoryRouter([{ path: "/", element: <App /> }])
    render(<RouterProvider router={router} />)
    expect(screen.getByRole("link", { name: "Cards & Events" })).toBeInTheDocument()
})
