import React, { useState, useEffect } from "react";
import PicklistOption from "../PicklistOption";
import AddressArray from "./address/AddressArray";
import { defaultAddress, defaultHousehold } from "../../data/defaultData";
import HHInfo from "./household/HHInfo";

export default function HouseholdContainer(props) {
    const [ selection, updateSelection ] = useState({
        householdId:  0,
        addressCount: 0,
        addrList: [{id: 0, line_1: ""}]
    })

    const [ selectedHH, updateSelectedHH ] = useState({ id: 0, nickname: "" })
    
    let picklistOptions = mapHouseholdData(props.householdList)

    function mapHouseholdData(hhList) {
        const output = hhList.sort((a, b) => {
            if (a.nickname.toLowerCase() > b.nickname.toLowerCase()) {
                return 1
            }
            if (a.nickname.toLowerCase() < b.nickname.toLowerCase()) {
                return -1
            }
            return 0
        });
        return output.map((selectedHousehold, index) =>
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
            addressCount:      props.addressList.filter((address) => address.household_id.toString() === event.target.value).length,
            addrList:      props.addressList.filter((address) => address.household_id.toString() === event.target.value)
        })
        
        // Update the household data for the selected object
        updateSelectedHH(props.householdList.filter((hh) => hh.id.toString() === event.target.value.toString())[0])
    }

    // When householdList changes, update state and the list of picklist options
    useEffect(() => {
        console.debug("List of households was updated.")

        // picklistOptions = mapHouseholdData(props.householdList)

        // Initialize the selected id to the first household in the list
        if (props.householdList[0].nickname) {
            updateSelection({
                householdId:       props.householdList[0].id,
                addressCount:      props.addressList.filter((address) => address.household_id.toString() === props.householdList[0].id).length,
                addrList:      props.addressList.filter((address) => address.household_id.toString() === props.householdList[0].id)
            })
        }
    }, [ props.householdList, props.addressList ])

    return (
        <section>
            <div className="title">Households</div>

            <div className="content">
                <div className="column-container">
                    <div className="col">
                        <span className="subtitle">Select Household</span>
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

                        <p className="debug">
                            hh_id: {"\t" + selection.householdId} <br />
                            nick: {"\t" + selectedHH.nickname} <br />
                            addresses: {"\t" + selection.addressCount} <br /><br />
                            addr0Id: {selection.addrList[0] ? selection.addrList[0].id : "..."} <br />
                            addr0Street: {selection.addrList[0] ? selection.addrList[0].line_1 : "..."} <br /><br />
                            addr1Id: {selection.addrList[1] ? selection.addrList[1].id : "n/a"} <br />
                            addr1Street: {selection.addrList[1] ? selection.addrList[1].line_1 : "n/a"} <br />
                        </p>
                    </div>
                    <div className="col">
                        <span className="subtitle">Household Info</span>
                        <HHInfo
                            id={selectedHH.id}
                            nickname={selectedHH.nickname}
                            firstNames={selectedHH.first_names}
                            surname={selectedHH.surname}
                            formalName={selectedHH.formal_name}
                            relationship={selectedHH.relationship}
                            relationshipType={selectedHH.relationship_type}
                            familySide={selectedHH.family_side}
                            kids={selectedHH.kids}
                            pets={selectedHH.pets}
                            shouldReceiveHolidayCard={selectedHH.should_receive_holiday_card}
                            notes={selectedHH.notes}
                            updateHHData={props.updateHHData}
                        />

                    </div>
                </div>

                <div className="column-container">
                    <div className="col">
                        <span className="subtitle">
                            {`${selection.addressCount > 1 ? "Addresses" : "Address"} for ${selectedHH.nickname}:`}
                        </span>
                        <AddressArray
                            householdId={selection.householdId}
                            householdNickname={selectedHH.nickname}
                            addressList={props.addressList}
                        />
                    </div>
                </div>
            </div>

        </section>
    )
}

HouseholdContainer.defaultProps = {
    householdList: [ defaultHousehold ],
    addressList:   [ defaultAddress ]
}
