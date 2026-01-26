import React from "react";
import AddressFields from "./AddressFields";
import "../../../styles/forms.css"
import { defaultAddress } from "../../../data/defaultData";

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
                id={address.id || 0}
                householdId={address.household_id || 0}
                line_1={address.line_1 || ""}
                line_2={address.line_2 || ""}
                city={address.city || ""}
                state={address.state || ""}
                zip={address.zip || ""}
                country={address.country || ""}
                fullAddress={address.full_address || ""}
                isCurrent={address.is_current === null ? false : address.is_current}
                isLikelyToChange={address.is_likely_to_change === null ? false : address.is_likely_to_change}
                mailToThisAddress={address.mail_the_card_to_this_address === null ? false : address.mail_the_card_to_this_address}
                createdDate={address.created_date || new Date().toLocaleString()}
                lastModified={address.last_modified || new Date().toLocaleString()}
                notes={address.notes || ""}
            />
        )

    return (
        <div className="address-array-container">
            {addressesForHousehold}
        </div>
    )
}

AddressArray.defaultProps = {
    householdId:    0,
    addressList:    [ defaultAddress ],
    nextIds:        { nextAddressId: 0, nextHouseholdId: 0 }
}
