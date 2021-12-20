import React, { useState, useEffect } from "react";

export default function HHInfo(props) {
    const initialState = {
        id:                       props.id,
        nickname:                 props.nickname || "",
        firstNames:               props.firstNames || "",
        surname:                  props.surname || "",
        formalName:               props.formalName || "",
        relationship:             props.relationship || "",
        relationshipType:         props.relationshipType || "",
        familySide:               props.familySide || "",
        kids:                     props.kids || "",
        shouldReceiveHolidayCard: props.shouldReceiveHolidayCard || "",
        notes:                    props.notes || ""
    }

    const [ hhData, updateHHData ] = useState(initialState)
    const isDisabled = false

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

        console.info(`Form ${event.target.id} submitted`)
        console.debug(`Form data: ${JSON.stringify(hhData)}`)
    }

    useEffect(() => {
        console.debug("Re-rendering HHInfo")

        // When props change, replace state with the new props values
        updateHHData(initialState)
    }, [ initialState, props ])

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
                >DeleteMePlz</label>

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
    shouldReceiveHolidayCard: 1,
    notes:                    ""
}
