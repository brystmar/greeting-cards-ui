import React, { useState } from "react";

export default function AddressFields(props) {
    const [address, updateAddress] = useState();

    return (
        <div className="address-fields-container">
            <div className="label-input-container">
                <label htmlFor="address-street-1" className="label-input">Street:</label>
                <input
                    type="text"
                    id="address-street-1"
                    name="address-street-1"
                    value={address.line_1}
                    className="input-text"
                    disabled="true"
                />
            </div>
        </div>
    )
}

AddressFields.defaultProps = {
    household: 1
}