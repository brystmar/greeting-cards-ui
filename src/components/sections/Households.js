import React, { useState, useEffect } from "react";
import PicklistOption from "../PicklistOption";
import AddressArray from "../groupings/AddressArray";

export default function Households(props) {
    const selectionDefault = {
        household: 0
    }

    const [ selection, updateSelection ] = useState(selectionDefault)
    let picklistOptions = mapHouseholdData(props.householdList)

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
        console.debug("Retrieving list of households:")
        // console.debug(props.householdList)

        picklistOptions = mapHouseholdData(props.householdList)

        // Initialize the selected id to the first household in the list
        if (props.householdList[0]) {
            updateSelection({ household: props.householdList[0].id })
        }
    }, [ props.householdList ])

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
                    {/*TODO: Show multiple addresses if they exist for a selected household*/}
                    <span className="subtitle">Address for hh_id={selection.id}</span>
                    <AddressArray
                        householdId={selection.id}
                        addressList={props.addressList}
                    />
                    <span><br/>selection={JSON.stringify(selection.household)}</span>
                    <span><br/>{JSON.stringify(props.addressList)}</span>
                    <span><br/>address={props.addressList.find(a => a.household_id === selection.household)}</span>
                </div>

            </div>
        </section>
    )
}

Households.defaultProps = {
    householdList: [ {
        id:                 0,
        name:               "",
        formal_name:        "",
        relationship:       "",
        primary_address_id: 0
    } ],
    addressList:   [ {
        id:                  0,
        household_id:        0,
        is_current:          0,
        is_likely_to_change: 0
    } ]
}

