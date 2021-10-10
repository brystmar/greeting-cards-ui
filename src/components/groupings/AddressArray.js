import React from "react";
import AddressFields from "./AddressFields";
import "../../styles/addresses.css"

export default function AddressArray(props) {
    /**
     Since a household might have more than one address, this component finds the relevant
     addresses for a given household and displays each

     * @param   {Number}   householdId  Numeric id of the household to find
     * @param   {Array}    addressList  List of address objects to search through
     * @return  {HTMLDivElement}        A div with
     */

    const addressesForHousehold = props.addressList
        // Find which addresses match the provided household
        .filter((address, index) =>
            address.household_id === props.householdId)

        // Create an AddressFields component for each matching address
        .map((address, index) =>
            <AddressFields
                key={index}
                id={address.id}
                line1={address.line_1}
                line2={address.line_2}
                city={address.city}
                state={address.state}
                postalCode={address.postal_code}
                country={address.country}
            />
        )

    return (
        <div className="address-array-container">
            {addressesForHousehold}
        </div>
    )
}

AddressArray.defaultProps = {
    householdId: 0,
    addressList: [ {
        id:                  0,
        household_id:        0,
        line_1:              "",
        line_2:              "",
        city:                "",
        state:               "",
        postal_code:         "",
        country:             "United States",
        is_current:          0,
        is_likely_to_change: 0
    } ]
}
