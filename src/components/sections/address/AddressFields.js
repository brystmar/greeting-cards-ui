import React, { useState, useEffect } from "react";
import {api} from "../../../data/endpoints";

export default function AddressFields(props) {
    const initialState = {
        id:                 props.id,
        householdId:        props.householdId,
        line_1:             props.line_1 || "",
        line_2:             props.line_2 || "",
        city:               props.city || "",
        state:              props.state || "",
        zip:                props.zip || "",
        country:            props.country || "",
        fullAddress:        props.fullAddress || "",
        isCurrent:          props.isCurrent === null ? false : props.isCurrent,
        isLikelyToChange:   props.isLikelyToChange === null ? false : props.isLikelyToChange,
        mailToThisAddress:  props.mailToThisAddress === null ? false : props.mailToThisAddress,
        createdDate:        props.createdDate || new Date().toISOString(),
        lastModified:       props.lastModified || new Date().toISOString(),
        notes:              props.notes || ""
    }

    const [ addressData, updateAddressData ] = useState(initialState)
    const isDisabled = false
    const hideDebug = true

    function handleChange(event) {
        // Update the id, nickname, and address count for the selected household
        updateAddressData({
            ...addressData,
            [event.target.name]: event.target.value
        })
    }

    function handleCheckboxChange(event) {
        // Default form handling of checkboxes is weird
        updateAddressData({
            ...addressData,
            [event.target.name]: event.target.checked
        })
    }

    function handleSave(event) {
        console.debug(`Save button for form ${event.target.id} clicked.`)

        // Don't refresh the page
        event.preventDefault()

        // Build the payload to submit
        console.debug(`Form data: ${JSON.stringify(addressData)}`)
        const updatedAddress = {
            id:                             addressData.id,
            line_1:                         addressData.line_1,
            line_2:                         addressData.line_2,
            city:                           addressData.city,
            state:                          addressData.state,
            zip:                            addressData.zip,
            country:                        addressData.country,
            is_current:                     addressData.isCurrent === null ? false : addressData.isCurrent,
            is_likely_to_change:            addressData.isLikelyToChange === null ? false : addressData.isLikelyToChange,
            mail_the_card_to_this_address:  addressData.mailToThisAddress === null ? false : addressData.mailToThisAddress,
            notes:                          addressData.notes
        }

        // Send this new address to the backend
        console.log(`Calling endpoint: [PUT] ${api.addresses.one}`)
        console.debug(`Request body: ${JSON.stringify(updatedAddress)}`)

        const serviceCallOptions = {
            method:  "PUT",
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body:    JSON.stringify(updatedAddress)
        }

        fetch(api.addresses.one, serviceCallOptions)
            .then(response => {
                console.debug(`PUT complete, response: ${response.status}; ${response.ok}`)
                return response.json()
            })
            .then(result => {
                console.log(`New address saved for address_id=${result}`)
            })
            .catch(err => {
                console.debug(`Errors caught: ${err}`)
            })

        console.info(`Form submission complete.`)
    }

    useEffect(() => {
        console.debug("Re-rendering AddressFields")
        updateAddressData({
            id:                   props.id,
            line_1:               props.line_1 || "",
            line_2:               props.line_2 || "",
            city:                 props.city || "",
            state:                props.state || "",
            zip:                  props.zip || "",
            country:              props.country || "",
            isCurrent:            props.isCurrent === null ? false : props.isCurrent,
            isLikelyToChange:     props.isLikelyToChange === null ? false : props.isLikelyToChange,
            mailToThisAddress:    props.mailToThisAddress === null ? false : props.mailToThisAddress,
            notes:                props.notes || ""
        })

    }, [ props ])

    return (
        <form id={`form-address-${props.index}`} className="address-fields" onSubmit={handleSave}>
            <div className="label-input-container">
                <label
                    htmlFor={`address-line-1-${props.index}`}
                    className="label-input"
                >Line 1</label>

                <input
                    type="text"
                    id={`address-line-1-${props.index}`}
                    name="line_1"
                    value={addressData.line_1}
                    onChange={handleChange}
                    className="input-text input-address-street"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor={`address-line-2-${props.index}`}
                    className="label-input"
                >Line 2</label>

                <input
                    type="text"
                    id={`address-line-2-${props.index}`}
                    name="line_2"
                    value={addressData.line_2}
                    onChange={handleChange}
                    className="input-text input-address-street"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor={`address-city-${props.index}`}
                    className="label-input"
                >City</label>

                <input
                    type="text"
                    id={`address-city-${props.index}`}
                    name="city"
                    value={addressData.city}
                    onChange={handleChange}
                    className="input-text input-address-city"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor={`address-state-${props.index}`}
                    className="label-input"
                >State</label>

                <input
                    type="text"
                    id={`address-state-${props.index}`}
                    name="state"
                    value={addressData.state}
                    onChange={handleChange}
                    className="input-text input-address-state"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor={`address-zip-${props.index}`}
                    className="label-input"
                >Zip</label>

                <input
                    type="text"
                    id={`address-zip-${props.index}`}
                    name="zip"
                    value={addressData.zip}
                    onChange={handleChange}
                    className="input-text input-address-zip"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor={`address-country-${props.index}`}
                    className="label-input"
                >Country</label>

                <input
                    type="text"
                    id={`address-country-${props.index}`}
                    name="country"
                    value={addressData.country}
                    onChange={handleChange}
                    className="input-text input-address-country"
                    disabled={isDisabled}
                />
            </div>

            {props.fullAddress ?
                // Only display the full address when it's used, typically for non-US addresses
                <div className="label-input-container">
                    <label
                        htmlFor={`address-full-${props.index}`}
                        className="label-input"
                    >Full Address</label>

                    <textarea
                        id={`address-full-${props.index}`}
                        name="fullAddress"
                        value={addressData.fullAddress}
                        onChange={handleChange}
                        className="input-textarea input-address-full"
                        disabled={isDisabled}
                    />
                </div>
                : null}

            <div className="label-checkbox-container">
                <input
                    type="checkbox"
                    id={`is-current-${props.index}`}
                    name="isCurrent"
                    checked={addressData.isCurrent}
                    onChange={handleCheckboxChange}
                    className="input-checkbox"
                    disabled={isDisabled}
                />

                <label
                    htmlFor={`is-current-${props.index}`}
                    className="label-checkbox"
                >Is current?</label>
            </div>

            <div className="label-checkbox-container">
                <input
                    type="checkbox"
                    id={`is-likely-to-change-${props.index}`}
                    name="isLikelyToChange"
                    checked={addressData.isLikelyToChange}
                    onChange={handleCheckboxChange}
                    className="input-checkbox"
                    disabled={isDisabled}
                />

                <label
                    htmlFor={`is-likely-to-change-${props.index}`}
                    className="label-checkbox"
                >Is likely to change?</label>
            </div>

            <div className="label-checkbox-container">
                <input
                    type="checkbox"
                    id={`mail-to-this-address-${props.index}`}
                    name="mailToThisAddress"
                    checked={addressData.mailToThisAddress}
                    onChange={handleCheckboxChange}
                    className="input-checkbox"
                    disabled={isDisabled}
                />

                <label
                    htmlFor={`mail-to-this-address-${props.index}`}
                    className="label-checkbox"
                >Mail to this address?</label>
            </div>

            <button type="submit" className="btn btn-submit" disabled={isDisabled}>Save Changes</button>

            <div className="debug" hidden={hideDebug}>
                addrId: {"\t" + props.id} <br />
                hhId: {"\t" + props.householdId} <br />
                {/*line_1: {"\t" + props.line_1 || ""} <br />*/}
                {/*line_2: {"\t" + props.line_2 || ""} <br />*/}
                {/*city: {"\t\t" + props.city || ""} <br />*/}
                {/*state: {"\t" + props.state || ""} <br />*/}
                {/*zip: {"\t\t" + props.zip || ""} <br />*/}
                {/*country: {"\t" + props.country || ""} <br />*/}
                {/*fullAddy: {"\t" + props.fullAddress || ""} <br />*/}
                isCurr: {"\t" + props.isCurrent + "\t" + typeof(props.isCurrent)} <br />
                isLike: {"\t" + props.isLikelyToChange + "\t" + typeof(props.isLikelyToChange)} <br />
                mailTo: {"\t" + props.mailToThisAddress + "\t" + typeof(props.mailToThisAddress)} <br />
            </div>
        </form>
    )
}

AddressFields.defaultProps = {
    id:                0,
    index:             0,
    householdId:       0,
    line_1:            "",
    line_2:            "",
    city:              "",
    state:             "",
    zip:               "",
    country:           "",
    fullAddress:       "",
    isCurrent:         true,
    isLikelyToChange:  true,
    mailToThisAddress: true,
    createdDate:       new Date().toISOString(),
    lastModified:      new Date().toISOString(),
    notes:             ""
}
