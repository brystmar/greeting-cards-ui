import HouseholdContainer from "../components/sections/HouseholdContainer"
import { useAppData } from "../context/AppDataContext"

export default function HouseholdsPage() {
    const {
        householdData,
        addressData,
        setHouseholdData,
        setAddressData,
        refresh,
        hhIndex,
        nextIds,
        // isLoading,
        error
    } = useAppData()

    if (error) {
        return (
            <div className="error-msg">
                <h2>Error loading data</h2>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <HouseholdContainer
            householdList={householdData}
            addressList={addressData}
            updateHHData={setHouseholdData}
            updateAddressData={setAddressData}
            refreshDataFromDB={refresh}
            hhIndex={hhIndex}
            nextIds={nextIds}
        />
    )
}
