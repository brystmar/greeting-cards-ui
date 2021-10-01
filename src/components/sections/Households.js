import React, { useState, useEffect } from "react";
import { households } from "../../data/testData";
import PicklistOption from "../PicklistOption";

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

    // Stubbing out for later when we use an API
    useEffect(() => {
        console.info("Retrieving list of households:")
        console.info(householdList)

        picklistOptions = mapHouseholdData(householdList)
    }, [ householdList ])

    return (
        <section>
            <div className="title">Households</div>

            <div className="content">
                <span>List of Households</span>
                <span>
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
            </div>
        </section>
    )
}
