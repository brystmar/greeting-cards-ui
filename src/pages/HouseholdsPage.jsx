import Households from "../components/sections/Households"
import { useHouseholds } from "../hooks/useHouseholds"
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

    // if (isLoading) {
    //     return (
    //         <div className="loading">
    //             <h2>Loading households…</h2>
    //         </div>
    //     )
    // }

    if (error) {
        return (
            <div className="error-msg">
                <h2>Error loading data</h2>
                <p>{error}</p>
            </div>
        )
    }

    return (
        <Households
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
