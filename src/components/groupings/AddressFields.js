import React from "react";

export default function AddressFields(props) {
    return (
        <div className="address-fields">
            <div className="label-input-container">
                <label htmlFor="household_id" className="label-input">Household_id:</label>
                <input
                    type="text"
                    id={`household_id-${props.index}`}
                    name="household_id"
                    value={props.householdId}
                    className="input-text"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label htmlFor="address-street-1" className="label-input">Street 1:</label>
                <input
                    type="text"
                    id={`address-street-1-${props.index}`}
                    name="address-street-1"
                    value={props.line1}
                    className="input-text"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label htmlFor="address-street-2" className="label-input">Street 2:</label>
                <input
                    type="text"
                    id={`address-street-2-${props.index}`}
                    name="address-street-2"
                    value={props.line2}
                    className="input-text"
                    disabled={true}
                />
            </div>
            
            <div className="label-input-container">
                <label htmlFor="address-city" className="label-input">City:</label>
                <input
                    type="text"
                    id={`address-city-${props.index}`}
                    name="address-city"
                    value={props.city}
                    className="input-text"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label htmlFor="address-state" className="label-input">State:</label>
                <input
                    type="text"
                    id={`address-state-${props.index}`}
                    name="address-state"
                    value={props.state}
                    className="input-text"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label htmlFor="address-postal-code" className="label-input">Postal Code:</label>
                <input
                    type="text"
                    id={`address-postal-code-${props.index}`}
                    name="address-postal-code"
                    value={props.postalCode}
                    className="input-text"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label htmlFor="address-country" className="label-input">Country:</label>
                <input
                    type="text"
                    id={`address-country-${props.index}`}
                    name="address-country"
                    value={props.country}
                    className="input-text"
                    disabled={true}
                />
            </div>
        </div>
    )
}

AddressFields.defaultProps = {
    index:       0,
    id:          0,
    householdId: 0,
    line1:       "",
    line2:       "",
    city:        "",
    state:       "",
    postalCode:  "",
    country:     "United States",
}
