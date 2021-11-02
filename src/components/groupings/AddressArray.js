import React from "react";
import AddressFields from "./AddressFields";
import "../../styles/addresses.css"
import { address } from "../../data/defaultData";

export default function AddressArray(props) {
    /**
     Since a household might have more than one address, this component finds and displays
     all addresses for a given household.

     * @param   {Number}   householdId  Numeric id of the household to find
     * @param   {Array}    addressList  List of address objects to search through
     * @return  {HTMLDivElement}        A div with
     */

    let addressesForHousehold = props.addressList
        // Find which addresses match the provided household
        .filter((address) => address.household_id.toString() === props.householdId.toString())
        /* TODO: The householdId picklist converts its numeric value to a string for reasons I don't
            understand, so I'm casting both values to strings as a workaround. */

        // Create an AddressFields component for each matching address
        .map((address, index) =>
            <AddressFields
                key={index}
                index={index}
                id={address.id}
                line_1={address.line_1}
                line_2={address.line_2}
                city={address.city}
                state={address.state}
                zip={address.zip}
                country={address.country}
                full_address={address.full_address}
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
    addressList: [ address ]
}
