import React, { useState, useEffect } from "react";
import { api } from "../../../data/endpoints";

export default function HHInfo(props) {
    const initialState = {
        id:                       props.id || 0,
        nickname:                 props.nickname || "",
        firstNames:               props.firstNames || "",
        surname:                  props.surname || "",
        addressTo:                props.addressTo || "",
        formalName:               props.formalName || "",
        relationshipType:         props.relationshipType || "",
        relationship:             props.relationship || "",
        familySide:               props.familySide || "",
        knownFrom:                props.knownFrom || "",
        kids:                     props.kids || "",
        pets:                     props.pets || "",
        shouldReceiveHolidayCard: props.shouldReceiveHolidayCard === null ? false : props.shouldReceiveHolidayCard,
        isRelevant:               props.isRelevant === null ? false : props.isRelevant,
        createdDate:              props.createdDate || new Date().toLocaleString(),
        lastModified:             props.lastModified || new Date().toLocaleString(),
        notes:                    props.notes || ""
    }

    const [ hhData, updateHHData ] = useState(initialState)
    const [ showConfirmation, updateShowConfirmation ] = useState(false)
    const [ disableSave, updateDisableSave] = useState(false)
    const isDisabled = false
    const isTesting = true
    const hideDebug = true

    // Adjust button text depending on mode
    const saveButtonText = props.insertNewRecordMode ? "Save New Household" : "Save Changes"

    // Update the id, nickname, and address count for the selected household
    function handleChange(event) {
        updateHHData({
            ...hhData,
            [event.target.name]: event.target.value
        })
    }

    // Default form handling for checkboxes is weird
    function handleCheckboxChange(event) {
        updateHHData({
            ...hhData,
            [event.target.name]: event.target.checked
        })
    }

    function handleSubmit(event) {
        console.debug(`Submit button for form ${event.target.id} clicked.`)

        // Disable fields and buttons until the service call is finished
        updateDisableSave(true)

        // Don't refresh the page
        event.preventDefault()

        // Build the payload to send
        let newHHData = {
            id:                          props.insertNewRecordMode ? props.nextIds.nextHouseholdId : hhData.id,
            nickname:                    hhData.nickname,
            first_names:                 hhData.firstNames,
            surname:                     hhData.surname,
            address_to:                  hhData.addressTo,
            formal_name:                 hhData.formalName,
            relationship:                hhData.relationship,
            relationship_type:           hhData.relationshipType,
            family_side:                 hhData.familySide,
            known_from:                  hhData.knownFrom,
            kids:                        hhData.kids,
            pets:                        hhData.pets,
            should_receive_holiday_card: hhData.shouldReceiveHolidayCard === null ? false : hhData.shouldReceiveHolidayCard,
            is_relevant:                 hhData.isRelevant === null ? false : hhData.isRelevant,
            created_date:                props.insertNewRecordMode ? new Date().toLocaleString() : props.createdDate,
            last_modified:               new Date().toLocaleString(),
            notes:                       hhData.notes
        }

        let functionToCall = props.updateOneHousehold
        let serviceCallMethod = props.insertNewRecordMode ? "POST" : "PUT"

        // These attributes are only needed when modifying an existing record
        if (!props.insertNewRecordMode) {
            newHHData = {
                ...newHHData,

            }

            functionToCall = props.updateOneHousehold
        }

        // Send this new household data to the backend
        console.log(`Calling endpoint: ${serviceCallMethod} ${api.households.one}`)
        // console.debug(`Request body in JSON: ${JSON.stringify(newHH)}`)

        const serviceCallOptions = {
            method:  serviceCallMethod,
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body:    JSON.stringify(newHHData)
        }

        fetch(api.households.one, serviceCallOptions)
            .then(response => {
                console.debug(`${serviceCallMethod} complete, response: ${response.status}; ${response.ok}`)
                return response.json()
            })
            .then(result => {
                console.log(`New address saved for hh_id=${result}`)

                // Briefly show the "Saved!" confirmation message
                updateShowConfirmation(true)

                // Replace the householdList entry with the newly-submitted household data
                // console.debug("Refreshing hhList from the database...")
                // props.refreshDataFromDB()

                // Re-enable fields and buttons now that the service call is complete
                updateDisableSave(false)
                props.updateInsertNewRecordMode(false)
            })
            .catch(err => {
                console.debug(`Errors caught: ${err}`)

                // Re-enable fields and buttons now that the service call is complete
                updateDisableSave(false)
                props.updateInsertNewRecordMode(false)
            })

        console.info(`Form ${event.target.id} submitted.`)
        // console.debug(`Form data: ${JSON.stringify(newHH)}`)

        // Update the existing list of households
        functionToCall(newHHData)
    }

    // Timeout for displaying the copy-to-clipboard confirmation
    useEffect(() => {
        if (showConfirmation) {
            const timeout = setTimeout(() => {
                updateShowConfirmation(false)
            }, 1000)

            return () => clearTimeout(timeout)
        }
    }, [ showConfirmation ])

    // Insert test data while testing
    useEffect(() => {
        if (isTesting) {
            updateHHData({
                nickname:   "0test Nick " + new Date().toISOString(),
                firstNames: "0test First Names",
                surname:    "0test Surname",
                notes:      new Date().toISOString()
            })
            console.debug("Inserted test data")
        }
    }, [ isTesting ])

    // When props change, replace state with the new props values
    useEffect(() => {
        console.debug("Household selection changed, re-rendering HHInfo")

        // updateHHData(props)
        updateHHData({
            id:                       props.id || 0,
            nickname:                 props.nickname || "",
            firstNames:               props.firstNames || "",
            surname:                  props.surname || "",
            addressTo:                props.addressTo || "",
            formalName:               props.formalName || "",
            relationshipType:         props.relationshipType || "",
            relationship:             props.relationship || "",
            familySide:               props.familySide || "",
            knownFrom:                props.knownFrom || "",
            kids:                     props.kids || "",
            pets:                     props.pets || "",
            shouldReceiveHolidayCard: props.shouldReceiveHolidayCard === null ? false : props.shouldReceiveHolidayCard,
            isRelevant:               props.isRelevant === null ? false : props.isRelevant,
            createdDate:              props.createdDate || new Date().toLocaleString(),
            lastModified:             props.lastModified || new Date().toLocaleString(),
            notes:                    props.notes || ""
        })
    }, [ props ])

    return (
        <form id="form-hh-info" className="hh-info" onSubmit={handleSubmit}>
            <div className="label-input-container">
                <label
                    htmlFor="hh-nickname"
                    className="label-input"
                >Nickname</label>

                <input
                    type="text"
                    id="hh-nickname"
                    name="nickname"
                    value={hhData.nickname}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                    autoFocus={!!props.insertNewRecordMode}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor="hh-first-names"
                    className="label-input"
                >First Names</label>

                <input
                    type="text"
                    id="hh-first-names"
                    name="firstNames"
                    value={hhData.firstNames}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor="hh-surname"
                    className="label-input"
                >Surname</label>

                <input
                    type="text"
                    id="hh-surname"
                    name="surname"
                    value={hhData.surname}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor="hh-address-to"
                    className="label-input"
                >Address To</label>

                <input
                    type="text"
                    id="hh-address-to"
                    name="addressTo"
                    value={hhData.addressTo}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor="hh-formal-name"
                    className="label-input"
                >Formal Name</label>

                <input
                    type="text"
                    id="hh-formal-name"
                    name="formalName"
                    value={hhData.formalName}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                />
            </div>

            <br/>

            <div className="label-input-container">
                <label
                    htmlFor="hh-kids"
                    className="label-input"
                >Kids</label>

                <input
                    type="text"
                    id="hh-kids"
                    name="kids"
                    value={hhData.kids}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor="hh-pets"
                    className="label-input"
                >Pets</label>

                <input
                    type="text"
                    id="hh-pets"
                    name="pets"
                    value={hhData.pets}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                />
            </div>

            <br/>

            <div className="label-input-container">
                <label
                    htmlFor="hh-relationship-type"
                    className="label-input"
                >Relationship Type</label>

                <input
                    type="text"
                    id="hh-relationship-type"
                    name="relationshipType"
                    value={hhData.relationshipType}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor="hh-relationship"
                    className="label-input"
                >Relationship</label>

                <input
                    type="text"
                    id="hh-relationship"
                    name="relationship"
                    value={hhData.relationship}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor="hh-family-side"
                    className="label-input"
                >Family Side</label>

                <input
                    type="text"
                    id="hh-family-side"
                    name="familySide"
                    value={hhData.familySide}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor="hh-known-from"
                    className="label-input"
                >Known From</label>

                <input
                    type="text"
                    id="hh-known-from"
                    name="knownFrom"
                    value={hhData.knownFrom}
                    onChange={handleChange}
                    className="input-text"
                    disabled={isDisabled}
                />
            </div>

            <br/>

            <div className="label-input-container">
                <label
                    htmlFor="hh-created-date"
                    className="label-input"
                >Date Added</label>

                <input
                    type="text"
                    id="hh-created-date"
                    name="createdDate"
                    value={hhData.createdDate}
                    onChange={handleChange}
                    className="input-date"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor="hh-last-modified"
                    className="label-input"
                >Last Modified</label>

                <input
                    type="text"
                    id="hh-last-modified"
                    name="createdDate"
                    value={hhData.lastModified}
                    onChange={handleChange}
                    className="input-datetime"
                    disabled={true}
                />
            </div>

            <div className="label-input-container">
                <label
                    htmlFor="hh-notes"
                    className="label-input"
                >Notes</label>

                <textarea
                    id="hh-notes"
                    name="notes"
                    value={hhData.notes}
                    onChange={handleChange}
                    className="input-text input-notes"
                    disabled={isDisabled}
                />
            </div>

            <div className="label-checkbox-container">
                <input
                    type="checkbox"
                    id="hh-should-receive-holiday-card"
                    name="shouldReceiveHolidayCard"
                    checked={hhData.shouldReceiveHolidayCard}
                    onChange={handleCheckboxChange}
                    className="input-checkbox"
                    disabled={isDisabled}
                />

                <label
                    htmlFor="hh-should-receive-holiday-card"
                    className="label-checkbox"
                >Include on the holiday card list</label>
            </div>

            <div className="label-checkbox-container">
                <input
                    type="checkbox"
                    id="hh-is-relevant"
                    name="isRelevant"
                    checked={hhData.isRelevant}
                    onChange={handleCheckboxChange}
                    className="input-checkbox"
                    disabled={isDisabled}
                />

                <label
                    htmlFor="hh-is-relevant"
                    className="label-checkbox"
                >Is still relevant?</label>
            </div>

            <div className="btn-container">
                <button type="submit" className="btn btn-submit" disabled={isDisabled || disableSave}>{saveButtonText}</button>
                <span className={showConfirmation ? "confirm-msg" : "confirm-msg hide"}>Saved!</span>
            </div>

            <div className="debug" hidden={hideDebug}>
                id: {"\t" + props.id} <br />
                nickname: {"\t" + props.nickname || ""} <br />
                {/*firstNames: {"\t" + props.firstNames || ""} <br />*/}
                {/*surname: {"\t" + props.surname || ""} <br />*/}
                {/*formalName: {"\t" + props.formalName || ""} <br />*/}
                {/*relationship: {"\t" + props.relationship || ""} <br />*/}
                {/*relationshipType: {"\t" + props.relationshipType || ""} <br />*/}
                {/*familySide: {"\t" + props.familySide || ""} <br />*/}
                {/*kids: {"\t\t" + props.kids || ""} <br />*/}
                shouldReceive: {"\t" + props.shouldReceiveHolidayCard.toString() + "\t" + typeof(props.shouldReceiveHolidayCard)} <br />
                isRelevant: {"\t\t" + props.isRelevant.toString() + "\t" + typeof(props.isRelevant)} <br />
                {/*notes: {"\t\t" + props.notes || ""} <br />*/}
            </div>
        </form>
    )
}

HHInfo.defaultProps = {
    id:                       0,
    nickname:                 "",
    firstNames:               "",
    surname:                  "",
    addressTo:                "",
    formalName:               "",
    relationship:             "",
    relationshipType:         "",
    familySide:               "",
    knownFrom:                "",
    kids:                     "",
    pets:                     "",
    shouldReceiveHolidayCard: true,
    isRelevant:               true,
    createdDate:              new Date().toISOString(),
    lastModified:             new Date().toISOString(),
    notes:                    "",
    insertNewRecordMode:      false,
    nextIds:                  { nextAddressId: 0, nextHouseholdId: 0 }
}
