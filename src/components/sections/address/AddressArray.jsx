import AddressFields from "./AddressFields"
import "../../../styles/forms.css"
import { defaultAddress } from "../../../data/defaultData"

export default function AddressArray({
                                         householdId = 0,
                                         addressList = [defaultAddress],
                                         insertNewHouseholdMode = false
                                     }) {
    // Filter addresses for the current household
    const addressesForHousehold = addressList.filter(
        (address) => address.household_id?.toString() === householdId.toString()
    )

    if (insertNewHouseholdMode || addressesForHousehold.length === 0) return null

    return (
        <div className="address-array-container">
            {addressesForHousehold.map((address) => {
                const {
                    id = 0,
                    household_id = 0,
                    line_1 = "",
                    line_2 = "",
                    city = "",
                    state = "",
                    zip = "",
                    country = "",
                    full_address = "",
                    is_current = false,
                    is_likely_to_change = false,
                    mail_the_card_to_this_address = false,
                    created_date,
                    last_modified,
                    notes = ""
                } = address

                return (
                    <AddressFields
                        key={id}
                        index={id}
                        id={id}
                        householdId={household_id}
                        line_1={line_1}
                        line_2={line_2}
                        city={city}
                        state={state}
                        zip={zip}
                        country={country}
                        fullAddress={full_address}
                        isCurrent={is_current}
                        isLikelyToChange={is_likely_to_change}
                        mailToThisAddress={mail_the_card_to_this_address}
                        createdDate={created_date || new Date().toLocaleString()}
                        lastModified={last_modified || new Date().toLocaleString()}
                        notes={notes}
                    />
                )
            })}
        </div>
    )
}
