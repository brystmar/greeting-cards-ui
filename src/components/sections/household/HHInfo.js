import React, { useState, useEffect } from "react";
import { api } from "../../../data/endpoints";

export default function HHInfo(props) {
    const initialState = {
        id:                       props.id || 0,
        nickname:                 props.nickname || "",
        firstNames:               props.firstNames || "",
        surname:                  props.surname || "",
        formalName:               props.formalName || "",
        relationship:             props.relationship || "",
        relationshipType:         props.relationshipType || "",
        familySide:               props.familySide || "",
        kids:                     props.kids || "",
        pets:                     props.pets || "",
        shouldReceiveHolidayCard: props.shouldReceiveHolidayCard || true,
        createdDate:              new Date().toISOString(),
        lastModified:             new Date().toISOString(),
        notes:                    props.notes || ""
    }

    const [ hhData, updateHHData ] = useState(initialState)
    const isDisabled = false
    const isTesting = false

    function handleChange(event) {
        // Update the id, nickname, and address count for the selected household
        updateHHData({
            ...hhData,
            [event.target.name]: event.target.value
        })
    }

    function handleCheckboxChange(event) {
        // Default form handling for checkboxes is weird
        updateHHData({
            ...hhData,
            [event.target.name]: event.target.checked
        })
    }

    function handleSubmit(event) {
        // Don't refresh the page
        event.preventDefault()

        // Build the payload to send
        const newHH = {
            nickname:                    hhData.nickname,
            first_names:                 hhData.firstNames,
            surname:                     hhData.surname,
            formal_name:                 hhData.formalName,
            relationship:                hhData.relationship,
            relationship_type:           hhData.relationshipType,
            family_side:                 hhData.familySide,
            kids:                        hhData.kids,
            pets:                        hhData.pets,
            should_receive_holiday_card: hhData.shouldReceiveHolidayCard,
            notes:                       hhData.notes
        }

        // POST newHH to the backend
        console.log(`Calling endpoint: [POST] ${api.households.one}`)
        console.debug(`Request body in JSON: ${JSON.stringify(newHH)}`)

        const options = {
            method:  "POST",
            headers: new Headers({ 'Content-Type': 'application/json' }),
            body:    JSON.stringify(newHH)
        }

        fetch(api.households.one, options)
            .then(response => {
                console.debug(`POST complete, response: ${response.status}; ${response.ok}`)
                return response.json()
            })
            .then(result => {
                console.log(`New address saved:`, result.data)

                // Refresh household data from the database
                props.updateHHData()
            })

        console.info(`Form ${event.target.id} submitted.`)
        console.debug(`Form data: ${JSON.stringify(newHH)}`)
    }

    useEffect(() => {
        // Insert test data while testing
        if (isTesting) {
            updateHHData({
                nickname:   "0test Nick " + new Date().toISOString(),
                firstNames: "0test First Names",
                surname:    "0test Surname",
                notes:      new Date().toISOString()
            })
        }
        console.debug("Inserting test data")

    }, [ isTesting ])

    useEffect(() => {
        console.debug("Props changed, re-rendering HHInfo")
        console.debug(`createdDate: ${props.createdDate}, ${typeof(props.createdDate)}`)

        // When props change, replace state with the new props values
        // updateHHData(initialState)
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

            <button type="submit" className="btn btn-submit" disabled={isDisabled}>Save Changes
            </button>

            <div className="debug">
                id: {"\t" + props.id} <br />
                nickname: {"\t" + props.nickname || ""} <br />
                {/*firstNames: {"\t" + props.firstNames || ""} <br />*/}
                {/*surname: {"\t" + props.surname || ""} <br />*/}
                {/*formalName: {"\t" + props.formalName || ""} <br />*/}
                {/*relationship: {"\t" + props.relationship || ""} <br />*/}
                {/*relationshipType: {"\t" + props.relationshipType || ""} <br />*/}
                {/*familySide: {"\t" + props.familySide || ""} <br />*/}
                {/*kids: {"\t\t" + props.kids || ""} <br />*/}
                {/*shouldReceiveHolidayCard: {"\t" + props.shouldReceiveHolidayCard || ""} <br />*/}
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
    formalName:               "",
    relationship:             "",
    relationshipType:         "",
    familySide:               "",
    kids:                     "",
    pets:                     "",
    shouldReceiveHolidayCard: true,
    createdDate:              new Date().toISOString(),
    lastModified:             new Date().toISOString(),
    notes:                    ""
}
