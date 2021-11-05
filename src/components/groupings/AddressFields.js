import React from "react";
import { defaultAddress } from "../../data/defaultData";

export default function AddressFields(props) {
    return (
        <div className="address-fields">
            <div className="label-input-container">
                <label
                    htmlFor={`address-line-1-${props.index}`}
                    className="label-input"
                >Line 1:</label>

                <input
                    type="text"
                    id={`address-line-1-${props.index}`}
                    name="address-line-1"
                    value={props.line_1 || ""}
                    className="input-text input-address-street"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor={`address-line-2-${props.index}`}
                    className="label-input"
                >Line 2:</label>

                <input
                    type="text"
                    id={`address-line-2-${props.index}`}
                    name="address-line-2"
                    value={props.line_2 || ""}
                    className="input-text input-address-street"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor={`address-city-${props.index}`}
                    className="label-input"
                >City:</label>

                <input
                    type="text"
                    id={`address-city-${props.index}`}
                    name="address-city"
                    value={props.city || ""}
                    className="input-text input-address-city"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor={`address-state-${props.index}`}
                    className="label-input"
                >State:</label>

                <input
                    type="text"
                    id={`address-state-${props.index}`}
                    name="address-state"
                    value={props.state || ""}
                    className="input-text input-address-state"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor={`address-zip-${props.index}`}
                    className="label-input"
                >Zip:</label>

                <input
                    type="text"
                    id={`address-zip-${props.index}`}
                    name="address-zip"
                    value={props.zip || ""}
                    className="input-text input-address-zip"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor={`address-country-${props.index}`}
                    className="label-input"
                >Country:</label>

                <input
                    type="text"
                    id={`address-country-${props.index}`}
                    name="address-country"
                    value={props.country || ""}
                    className="input-text input-address-country"
                    disabled={true}
                />
            </div>

            {props.full_address ?
                // Only display the full address when it's used, typically for non-US addresses
                <div className="label-input-container">
                    <label
                        htmlFor={`address-full-${props.index}`}
                        className="label-input"
                    >Full Address:</label>

                    <textarea
                        id={`address-full-${props.index}`}
                        name="address-full"
                        value={props.full_address || ""}
                        className="input-textarea input-address-full"
                        disabled={true}
                    />
                </div>
                : null}

        </div>
    )
}

AddressFields.defaultProps = defaultAddress
