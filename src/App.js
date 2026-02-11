import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { Outlet } from "react-router"
import "./styles/styles.css"
import "./styles/sections.css"

export default function App() {
    return (
        <div className="app-container">
            <header className="header-container">
                <NavBar />
            </header>

            <main className="app-content">
                <Outlet />
            </main>

            <footer className="footer-container">
                <Footer />
            </footer>
        </div>
    )
}
