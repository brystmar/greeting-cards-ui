import { NavLink } from "react-router"
import "../styles/nav.css"

export default function NavBar() {
    const navItems = [
        { name: "Households", path: "/households" },
        { name: "Events", path: "/events" },
        { name: "Cards", path: "/cards" }
    ]

    const navLinks = navItems.map((item) => (
        <span className="nav-tab">
            <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                    `nav-link ${isActive ? "selected-tab" : ""}`
                }
                title={item.name}
            >
                {item.name}
            </NavLink>
        </span>
    ))

    return (
        <nav
            role="navigation"
            aria-label="Navigation links"
        >
            {navLinks}
        </nav>
    )
}
