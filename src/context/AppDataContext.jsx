import { createContext, useContext } from "react"
import useHouseholds from "../hooks/useHouseholds"

const AppDataContext = createContext(null)

export function AppDataProvider({ children }) {
    const householdsData = useHouseholds()

    return (
        <AppDataContext.Provider value={householdsData}>
            {children}
        </AppDataContext.Provider>
    )
}

export function useAppData() {
    return useContext(AppDataContext)
}
