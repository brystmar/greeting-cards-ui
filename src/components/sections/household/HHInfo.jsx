import { useState, useEffect } from "react"
import { api } from "../../../data/endpoints"

export default function HHInfo({
                                   id = 0,
                                   nickname = "",
                                   firstNames = "",
                                   surname = "",
                                   addressTo = "",
                                   formalName = "",
                                   relationshipType = "",
                                   relationship = "",
                                   familySide = "",
                                   knownFrom = "",
                                   kids = "",
                                   pets = "",
                                   shouldReceiveHolidayCard = true,
                                   isRelevant = true,
                                   createdDate = new Date().toLocaleString(),
                                   lastModified = new Date().toLocaleString(),
                                   notes = "",
                                   insertNewHouseholdMode = false,
                                   nextIds = { nextHouseholdId: 0, nextAddressId: 0 },
                                   updateOneHousehold,
                                   insertNewHousehold,
                                   updateInsertNewHouseholdMode
                               }) {
    const [hhData, setHHData] = useState({
        id,
        nickname,
        firstNames,
        surname,
        addressTo,
        formalName,
        relationshipType,
        relationship,
        familySide,
        knownFrom,
        kids,
        pets,
        shouldReceiveHolidayCard,
        isRelevant,
        createdDate,
        lastModified,
        notes
    })

    const [showConfirmation, setShowConfirmation] = useState(false)
    const [disableSave, setDisableSave] = useState(false)

    const isDisabled = false
    const hideDebug = true

    const saveButtonText = insertNewHouseholdMode ? "Add This Household" : "Save Changes"
    const btnConfirmationText = insertNewHouseholdMode ? "Added!" : "Saved!"

    // Generic input handler
    const handleChange = (e) => setHHData(prev => ({ ...prev, [e.target.name]: e.target.value }))
    const handleCheckboxChange = (e) => setHHData(prev => ({ ...prev, [e.target.name]: e.target.checked }))

    // Submit handler
    const handleSubmit = async (e) => {
        e.preventDefault()
        setDisableSave(true)

        const payload = {
            id: insertNewHouseholdMode ? nextIds.nextHouseholdId : hhData.id,
            nickname: hhData.nickname,
            first_names: hhData.firstNames,
            surname: hhData.surname,
            address_to: hhData.addressTo,
            formal_name: hhData.formalName,
            relationship_type: hhData.relationshipType,
            relationship: hhData.relationship,
            family_side: hhData.familySide,
            known_from: hhData.knownFrom,
            kids: hhData.kids,
            pets: hhData.pets,
            should_receive_holiday_card: hhData.shouldReceiveHolidayCard,
            is_relevant: hhData.isRelevant,
            created_date: insertNewHouseholdMode ? new Date().toLocaleString() : createdDate,
            last_modified: new Date().toLocaleString(),
            notes: hhData.notes,
            ...(insertNewHouseholdMode ? { address_id: nextIds.nextAddressId } : {})
        }

        const method = insertNewHouseholdMode ? "POST" : "PUT"
        const serviceFn = insertNewHouseholdMode ? insertNewHousehold : updateOneHousehold

        try {
            const response = await fetch(api.households.one, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            const result = await response.json()
            console.log(`Household saved for id=${result}`)

            setShowConfirmation(true)
            updateInsertNewHouseholdMode(false)
        } catch (err) {
            console.error("Error saving household:", err)
            updateInsertNewHouseholdMode(false)
        } finally {
            setDisableSave(false)
            serviceFn(payload)
        }
    }

    // Auto-hide confirmation message
    useEffect(() => {
        if (showConfirmation) {
            const timeout = setTimeout(() => setShowConfirmation(false), 1000)
            return () => clearTimeout(timeout)
        }
    }, [showConfirmation])

    // Sync state if props change
    useEffect(() => {
        setHHData({
            id,
            nickname,
            firstNames,
            surname,
            addressTo,
            formalName,
            relationshipType,
            relationship,
            familySide,
            knownFrom,
            kids,
            pets,
            shouldReceiveHolidayCard,
            isRelevant,
            createdDate,
            lastModified,
            notes
        })
    }, [
        id,
        nickname,
        firstNames,
        surname,
        addressTo,
        formalName,
        relationshipType,
        relationship,
        familySide,
        knownFrom,
        kids,
        pets,
        shouldReceiveHolidayCard,
        isRelevant,
        createdDate,
        lastModified,
        notes
    ])

    const textFields = [
        { label: "Nickname", name: "nickname", autoFocus: insertNewHouseholdMode },
        { label: "First Names", name: "firstNames" },
        { label: "Surname", name: "surname" },
        { label: "Address To", name: "addressTo" },
        { label: "Formal Name", name: "formalName" },
        { label: "Kids", name: "kids" },
        { label: "Pets", name: "pets" },
        { label: "Relationship Type", name: "relationshipType" },
        { label: "Relationship", name: "relationship" },
        { label: "Family Side", name: "familySide" },
        { label: "Known From", name: "knownFrom" },
        { label: "Notes", name: "notes", isTextArea: true },
        { label: "Date Added", name: "createdDate", disabled: true },
        { label: "Last Modified", name: "lastModified", disabled: true }
    ]

    const checkboxes = [
        { label: "Include on the holiday card list", name: "shouldReceiveHolidayCard" },
        { label: "Is still relevant?", name: "isRelevant" }
    ]

    return (
        <form id="form-hh-info" className="hh-info" onSubmit={handleSubmit}>
            {textFields.map((f) => (
                <div key={f.name} className="label-input-container">
                    <label htmlFor={`hh-${f.name}`} className="label-input">{f.label}</label>
                    {f.isTextArea ? (
                        <textarea
                            id={`hh-${f.name}`}
                            name={f.name}
                            value={hhData[f.name]}
                            onChange={handleChange}
                            className="input-text input-notes"
                            disabled={f.disabled ?? isDisabled}
                        />
                    ) : (
                        <input
                            type="text"
                            id={`hh-${f.name}`}
                            name={f.name}
                            value={hhData[f.name]}
                            onChange={handleChange}
                            className="input-text"
                            autoFocus={f.autoFocus || false}
                            disabled={f.disabled ?? isDisabled}
                        />
                    )}
                </div>
            ))}

            {checkboxes.map((c) => (
                <div key={c.name} className="label-checkbox-container">
                    <input
                        type="checkbox"
                        id={`hh-${c.name}`}
                        name={c.name}
                        checked={hhData[c.name]}
                        onChange={handleCheckboxChange}
                        className="input-checkbox"
                        disabled={isDisabled}
                    />
                    <label htmlFor={`hh-${c.name}`} className="label-checkbox">{c.label}</label>
                </div>
            ))}

            <div className="btn-container">
                <button type="submit" className="btn btn-submit" disabled={isDisabled || disableSave}>
                    {saveButtonText}
                </button>
                <span className={showConfirmation ? "confirm-msg" : "confirm-msg hide"}>
          {btnConfirmationText}
        </span>
            </div>

            <div className="debug" hidden={hideDebug}>
                id: {id} <br />
                nickname: {nickname} <br />
                shouldReceive: {shouldReceiveHolidayCard.toString()} <br />
                isRelevant: {isRelevant.toString()} <br />
            </div>
        </form>
    )
}
