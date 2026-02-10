import Households from "../components/sections/Households"
import { useHouseholds } from "../hooks/useHouseholds"

export default function HouseholdsPage() {
    const {
        householdData,
        addressData,
        setHouseholdData,
        setAddressData,
        refresh,
        hhIndex,
        nextIds,
        loading,
        error
    } = useHouseholds()

    if (loading) return <div>Loading households…</div>
    if (error) return <div>Error loading data</div>

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
