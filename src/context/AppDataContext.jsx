import { createContext, useContext } from "react"
import useHouseholds from "../hooks/useHouseholds"

const AppDataContext = createContext(null)
AppDataContext.displayName = "AppDataContext"

export function AppDataProvider({ children }) {
    const householdsData = useHouseholds()

    return (
        <AppDataContext.Provider value={householdsData}>
            {children}
        </AppDataContext.Provider>
    )
}

export function useAppData() {
    const ctx = useContext(AppDataContext)

    if (!ctx) {
        throw new Error("useAppData must be used inside <AppDataProvider>")
    }

    return ctx
}
