import React, { useState } from "react";
import { defaultAddress } from "../../data/defaultData";

export default function AddressFields(props) {
    const [ state, updateState ] = useState({
        householdId:      props.householdId,
        line_1:           "",
        line_2:           "",
        city:             "",
        state:            "",
        zip:              "",
        country:          "",
        fullAddress:      "",
        isCurrent:        props.isCurrent === 1,
        isLikelyToChange: props.isLikelyToChange === 1
    })

    function handleChange(event) {
        // Update the id, nickname, and address count for the selected household
        updateState({
            ...state,
            [event.target.name]: event.target.value
        })
    }

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
                    name="line_1"
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
                    name="line_2"
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
                    name="city"
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
                    name="state"
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
                    name="zip"
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
                    name="country"
                    value={props.country || ""}
                    className="input-text input-address-country"
                    disabled={true}
                />
            </div>

            {props.fullAddress ?
                // Only display the full address when it's used, typically for non-US addresses
                <div className="label-input-container">
                    <label
                        htmlFor={`address-full-${props.index}`}
                        className="label-input"
                    >Full Address:</label>

                    <textarea
                        id={`address-full-${props.index}`}
                        name="fullAddress"
                        value={props.fullAddress || ""}
                        className="input-textarea input-address-full"
                        disabled={true}
                    />
                </div>
                : null}

            <div className="label-checkbox-container">
                <input
                    type="checkbox"
                    id={`is-current-${props.isCurrent}`}
                    name="isCurrent"
                    value={state.isCurrent}
                    checked={state.isCurrent}
                    onChange={handleChange}
                    className="input-checkbox"
                    disabled={false}
                />

                <label
                    htmlFor={`is-current-${props.isCurrent}`}
                    className="label-checkbox"
                >Is Current?</label>
            </div>

            <div className="label-checkbox-container">
                <input
                    type="checkbox"
                    id={`is-likely-to-change-${props.isCurrent}`}
                    name="isLikelyToChange"
                    value={state.isLikelyToChange}
                    checked={state.isLikelyToChange}
                    onChange={handleChange}
                    className="input-checkbox"
                    disabled={false}
                />

                <label
                    htmlFor={`is-likely-to-change-${props.isCurrent}`}
                    className="label-checkbox"
                >Is Likely To Change?</label>
            </div>

        </div>
    )
}

AddressFields.defaultProps = defaultAddress
