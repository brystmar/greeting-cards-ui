import React, { useState, useEffect } from "react";
import PicklistOption from "../PicklistOption";
import { households } from "../../data/testData";

export default function Households() {

    const selectionDefault = {
        household: ""
    }

    const [ householdList, updateHouseholdList ] = useState(households)
    const [ selection, updateSelection ] = useState(selectionDefault)
    let picklistOptions = mapHouseholdData(householdList)

    function mapHouseholdData(list) {
        return list.map((household, index) =>
            <PicklistOption
                key={index}
                value={household.id}
                name={household.name}
                formalName={household.formal_name}
                relationship={household.relationship}
                primaryAddressId={household.primary_address_id}
            />
        )
    }

    function handleChange(event) {
        updateSelection({
            ...selection,
            [event.target.name]: event.target.value
        })
    }

    // Update the list of picklist options when householdList changes
    // Stubbing out for later when we use an API
    useEffect(() => {
        console.info("Retrieving list of households:")
        console.info(householdList)

        picklistOptions = mapHouseholdData(householdList)
    }, [ householdList ])

    // Update


    return (
        <section>
            <div className="title">Households</div>

            <div className="content column-container">
                <div className="col">
                    <span className="subtitle">List of Households</span>
                    <span className="picklist-container">
                        <select
                            name="household"
                            className="picklist"
                            id="households-picklist"
                            value={selection.household}
                            onChange={handleChange}
                            required={false}
                        >
                            {picklistOptions}
                        </select>
                    </span>
                    <span>{JSON.stringify(selection)}</span>
                </div>

                <div className="col">
                    <span>Display address info for household_id={selection.household}</span>
                    {/*TODO: Show multiple addresses if they exist for a selected household*/}
                </div>

            </div>
        </section>
    )
}
