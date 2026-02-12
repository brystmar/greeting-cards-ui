import { useEffect, useState } from "react"
import NavBar from "./components/NavBar"
import Footer from "./components/Footer"
import { Outlet } from "react-router"
import { AppDataProvider, useAppData } from "./context/AppDataContext"
import "./styles/styles.css"
import "./styles/sections.css"

function AppLayout() {
    const { loading } = useAppData()

    const [showSpinner, setShowSpinner] = useState(false)
    const [isBootstrapped, setIsBootstrapped] = useState(false)

    // Hide the loading message and spinner initially to prevent screen flickering
    useEffect(() => {
        let timer

        if (loading) {
            timer = setTimeout(() => {
                setShowSpinner(true)
                setIsBootstrapped(true)
            }, 500)
        } else {
            setShowSpinner(false)
            setIsBootstrapped(true)
        }

        return () => clearTimeout(timer)
    }, [loading])

    return (
        <div className="app-container">
            <header className="header-container">
                <NavBar />
            </header>

            <main className="app-content">
                { isBootstrapped && showSpinner && (<div className="loading">Loading households…</div>) }

                { isBootstrapped && !loading && <Outlet /> }
            </main>

            {isBootstrapped && !loading && (
                <footer className="footer-container">
                    <Footer />
                </footer>
            )}
        </div>
    )
}

export default function App() {
    return (
        <AppDataProvider>
            <AppLayout />
        </AppDataProvider>
    )
}
