import React from "react";

export default function AddressFields(props) {
    console.debug(`Rendering AddressFields: ${JSON.stringify(props)}`)

    return (
        <div className="address-fields-container">
            <div className="label-input-container">
                <label htmlFor="hh_id" className="label-input">Household_id:</label>
                <input
                    type="text"
                    id="hh_id"
                    name="hh_id"
                    value={props.address.household_id}
                    className="input-text"
                    disabled={true}
                />
            </div>
            <div className="label-input-container">
                <label htmlFor="address-street-1" className="label-input">Street:</label>
                <input
                    type="text"
                    id="address-street-1"
                    name="address-street-1"
                    value={props.address.line_1}
                    className="input-text"
                    disabled={true}
                />
            </div>
        </div>
    )
}

AddressFields.defaultProps = {
    address: {
        id:                  0,
        household_id:        0,
        line_1:              "",
        line_2:              "",
        city:                "",
        state:               "",
        postal_code:         "",
        country:             "",
        is_current:          0,
        is_likely_to_change: 0
    }
}
