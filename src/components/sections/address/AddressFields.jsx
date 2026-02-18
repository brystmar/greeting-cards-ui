import { useState, useEffect } from "react"
import { api } from "../../../data/endpoints"

export default function AddressFields({
                                          id = 0,
                                          index = 0,
                                          householdId = 0,
                                          line_1 = "",
                                          line_2 = "",
                                          city = "",
                                          state = "",
                                          zip = "",
                                          country = "",
                                          fullAddress = "",
                                          isCurrent = true,
                                          isLikelyToChange = false,
                                          mailToThisAddress = true,
                                          createdDate = new Date().toISOString(),
                                          lastModified = new Date().toISOString(),
                                          notes = ""
                                      }) {
    const [addressData, setAddressData] = useState({
        id, householdId, line_1, line_2, city, state, zip, country, fullAddress, isCurrent, isLikelyToChange,
        mailToThisAddress, createdDate, lastModified, notes
    })

    const [ showConfirmation, setShowConfirmation ] = useState(false)
    const [ disableSave, setDisableSave ] = useState(false)
    const hideDebug = true
    const isDisabled = false

    // Handle text input changes
    const handleChange = (e) =>
        setAddressData((prev) => ({ ...prev, [e.target.name]: e.target.value }))

    // Handle checkbox changes
    const handleCheckboxChange = (e) =>
        setAddressData((prev) => ({ ...prev, [e.target.name]: e.target.checked }))

    // Save address to backend
    const handleSave = async (e) => {
        e.preventDefault()
        setDisableSave(true)

        const payload = {
            id: addressData.id,
            line_1: addressData.line_1,
            line_2: addressData.line_2,
            city: addressData.city,
            state: addressData.state,
            zip: addressData.zip,
            country: addressData.country,
            is_current: addressData.isCurrent,
            is_likely_to_change: addressData.isLikelyToChange,
            mail_the_card_to_this_address: addressData.mailToThisAddress,
            notes: addressData.notes
        }

        try {
            const response = await fetch(api.addresses.one, {
                method: "PUT",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload)
            })

            const result = await response.json()
            console.log(`Address saved for id=${result}`)

            setShowConfirmation(true)
        } catch (err) {
            console.error("Error saving address:", err)
        } finally {
            setDisableSave(false)
        }
    }

    // Auto-hide confirmation message after 1 second
    useEffect(() => {
        if (showConfirmation) {
            const timeout = setTimeout(() => setShowConfirmation(false), 1000)
            return () => clearTimeout(timeout)
        }
    }, [showConfirmation])

    // Update local state if props change
    useEffect(() => {
        setAddressData({
            id, householdId, line_1, line_2, city, state, zip, country, fullAddress, isCurrent, isLikelyToChange,
            mailToThisAddress, createdDate, lastModified, notes
        })
    }, [ id, householdId, line_1, line_2, city, state, zip, country, fullAddress, isCurrent, isLikelyToChange,
        mailToThisAddress, createdDate, lastModified, notes
    ])

    return (
        <form id={`form-address-${index}`} className="address-fields" onSubmit={handleSave}>
            {[
                { label: "Line 1", name: "line_1", type: "text" },
                { label: "Line 2", name: "line_2", type: "text" },
                { label: "City", name: "city", type: "text" },
                { label: "State", name: "state", type: "text" },
                { label: "Zip", name: "zip", type: "text" },
                { label: "Country", name: "country", type: "text" }
            ].map((field) => (
                <div key={field.name} className="label-input-container">
                    <label htmlFor={`address-${field.name}-${index}`} className="label-input">
                        {field.label}
                    </label>
                    <input
                        type={field.type}
                        id={`address-${field.name}-${index}`}
                        name={field.name}
                        value={addressData[field.name] ?? ""}
                        onChange={handleChange}
                        className={`input-text input-address-${field.name}`}
                        disabled={isDisabled}
                    />
                </div>
            ))}

            {fullAddress && (
                <div className="label-input-container">
                    <label htmlFor={`address-full-${index}`} className="label-input">Full Address</label>
                    <textarea
                        id={`address-full-${index}`}
                        name="fullAddress"
                        value={addressData.fullAddress}
                        onChange={handleChange}
                        className="input-textarea input-address-full"
                        disabled={isDisabled}
                    />
                </div>
            )}

            {[
                { label: "Is current?", name: "isCurrent" },
                { label: "Is likely to change?", name: "isLikelyToChange" },
                { label: "Mail to this address?", name: "mailToThisAddress" }
            ].map((checkbox) => (
                <div key={checkbox.name} className="label-checkbox-container">
                    <input
                        type="checkbox"
                        id={`${checkbox.name}-${index}`}
                        name={checkbox.name}
                        checked={addressData[checkbox.name]}
                        onChange={handleCheckboxChange}
                        className="input-checkbox"
                        disabled={isDisabled}
                    />
                    <label htmlFor={`${checkbox.name}-${index}`} className="label-checkbox">
                        {checkbox.label}
                    </label>
                </div>
            ))}

            <div className="btn-container">
                <button type="submit" className="btn btn-submit" disabled={isDisabled || disableSave}>
                    Save Changes
                </button>
                <span className={showConfirmation ? "confirm-msg" : "confirm-msg hide"}>Saved!</span>
            </div>

            <div className="debug" hidden={hideDebug}>
                addrId: {id} <br />
                hhId: {householdId} <br />
                isCurr: {String(isCurrent)} <br />
                isLike: {String(isLikelyToChange)} <br />
                mailTo: {String(mailToThisAddress)} <br />
            </div>
        </form>
    )
}
