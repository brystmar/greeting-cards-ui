import React, { useState, useEffect } from "react";
import PicklistOption from "../PicklistOption";
import AddressArray from "../groupings/AddressArray";
import { defaultAddress, defaultHousehold } from "../../data/defaultData";

export default function Households(props) {
    const [ selection, updateSelection ] = useState({
        householdId:       0,
        householdNickname: "",
        addressCount:      0
    })
    let picklistOptions = mapHouseholdData(props.householdList)

    function mapHouseholdData(hhList) {
        return hhList.map((selectedHousehold, index) =>
            <PicklistOption
                key={index}
                id={selectedHousehold.id}
                nickname={selectedHousehold.nickname}
            />
        )
    }

    function handleHouseholdChange(event) {
        // Update the id, nickname, and address count for the selected household
        updateSelection({
                ...selection,
                householdId:       event.target.value,
                householdNickname: props.householdList.filter((hh) => hh.id.toString() === event.target.value.toString())[0].nickname,
                addressCount:      props.addressList.filter((address) => address.household_id.toString() === event.target.value).length
            }
        )
    }

    // When householdList changes, update state and the list of picklist options
    useEffect(() => {
        console.debug("List of households was updated.")

        // picklistOptions = mapHouseholdData(props.householdList)

        // Initialize the selected id to the first household in the list
        if (props.householdList[0].nickname) {
            updateSelection({
                householdId:       props.householdList[0].id,
                householdNickname: props.householdList.filter((hh) => hh.id.toString() === props.householdList[0].id.toString())[0].nickname,
                addressCount:      props.addressList.filter((address) => address.household_id.toString() === props.householdList[0].id).length
            })
        }
    }, [ props.householdList, props.addressList ])

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
                            size={Math.min(props.householdList.length, 10)}
                            value={selection.householdId}
                            onChange={handleHouseholdChange}
                            required={false}
                        >
                            {picklistOptions}
                        </select>
                    </span>

                    <span className="debug">
                        {`selection:\n${JSON.stringify(selection)}`}
                    </span>
                </div>

                <div className="col">
                    <span className="subtitle">
                        {`${selection.addressCount > 1 ? "Addresses" : "Address"} for ${selection.householdNickname}:`}
                    </span>
                    <AddressArray
                        householdId={selection.householdId}
                        householdNickname={selection.householdNickname}
                        addressList={props.addressList}
                    />
                </div>
            </div>
        </section>
    )
}

Households.defaultProps = {
    householdList: [ defaultHousehold ],
    addressList:   [ defaultAddress ]
}
