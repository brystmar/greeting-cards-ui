import React, {useState} from "react";
import "../styles/nav.css"

export default function NavBar() {
    const navItems = [ "Households", "Events", "Cards" ]
    const [ selectedTab, updateSelectedTab ] = useState("Households")

    const navLinks = navItems.map((item) =>
        <span className="nav-tab" title={item}><a
            className={item.toString() === selectedTab ? "nav-link selected-tab" : "nav-link"}
            href={`/#${item}`}
            title={item}
        >{item}</a></span>
    )

    return (
        <nav
            className="navbar"
            onClick={(event) => updateSelectedTab(event.target.title)}
            role="navigation"
            aria-label="Navigation links"
        >{navLinks}</nav>
    )
}
