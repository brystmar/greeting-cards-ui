import React, { useState, useEffect } from "react";
import PicklistOption from "../PicklistOption";
import AddressArray from "../groupings/AddressArray";

export default function Households(props) {
    const selectionDefault = {
        householdId: 0
    }

    const [ selection, updateSelection ] = useState(selectionDefault)
    let picklistOptions = mapHouseholdData(props.householdList)

    function mapHouseholdData(allHouseholds) {
        return allHouseholds.map((selectedHousehold, index) =>
            <PicklistOption
                key={index}
                value={selectedHousehold.id}
                name={selectedHousehold.nickname}
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
        console.debug("List of households was updated.")
        // console.debug(props.householdList)

        // picklistOptions = mapHouseholdData(props.householdList)

        // Initialize the selected id to the first household in the list
        if (props.householdList[0]) {
            updateSelection({ householdId: props.householdList[0].id })
        }
    }, [ props.householdList ])

    // Update


    return (
        <section>
            <div className="title">Households</div>

            <div className="content column-container">
                <div className="col">
                    <span className="subtitle">List of Households</span>
                    <span className="selection-box">
                        <select
                            name="householdId"
                            id="households-selection-box"
                            className="selection-box"
                            // size={props.householdList.length}
                            size={Math.min(props.householdList.length, 10)}
                            value={selection.householdId}
                            onChange={handleChange}
                            required={false}
                        >
                            {picklistOptions}
                        </select>
                    </span>
                    <span className="debug"><br />{JSON.stringify(selection)}</span>
                </div>

                <div className="col">
                    <span className="subtitle">Address(es) for hh_id={selection.householdId}</span>
                    <AddressArray
                        householdId={selection.householdId}
                        addressList={props.addressList}
                    />
                    <span className="debug"><br />selection={JSON.stringify(selection.householdId)}</span>
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

