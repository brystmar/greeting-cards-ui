import React from "react";

export default function AddressFields(props) {
    return (
        <div className="address-fields">
            <div className="label-input-container">
                <label htmlFor="address-street-1" className="label-input">Street 1:</label>
                <input
                    type="text"
                    id={`address-street-1-${props.index}`}
                    name="address-street-1"
                    value={props.line_1 ? props.line_1 : ""}
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
                    value={props.line_2 ? props.line_2 : ""}
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
                    value={props.city ? props.city : ""}
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
                    value={props.state ? props.state : ""}
                    className="input-text"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label htmlFor="address-zip" className="label-input">Zip:</label>
                <input
                    type="text"
                    id={`address-zip-${props.index}`}
                    name="address-zip"
                    value={props.zip ? props.zip : ""}
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
                    value={props.country ? props.country : ""}
                    className="input-text"
                    disabled={true}
                />
            </div>
        </div>
    )
}

AddressFields.defaultProps = {
    index:        0,
    id:           0,
    line_1:       "",
    line_2:       "",
    city:         "",
    state:        "",
    zip:          "",
    country:      "United States",
    full_address: ""
}
