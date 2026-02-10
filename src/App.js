import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import HouseholdsPage from "./pages/HouseholdsPage"
import "./styles/styles.css"
import "./styles/sections.css"

export default function App() {
    return (
        <div className="app-container">
            <header className="header-container">
                <NavBar />
            </header>

            <main className="app-content">
                <HouseholdsPage />
            </main>

            <footer className="footer-container">
                <Footer />
            </footer>
        </div>
    )
}
