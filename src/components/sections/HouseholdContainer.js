import React, { useState, useEffect } from "react";
import PicklistOption from "../PicklistOption";
import AddressArray from "./address/AddressArray";
import { defaultAddress, defaultHousehold } from "../../data/defaultData";
import HHInfo from "./household/HHInfo";
import HouseholdSearchResult from "./household/HHSearchResult";

export default function HouseholdContainer(props) {
    const [ selection, updateSelection ] = useState({
        householdId:  0,
        addressCount: 0,
        addrList:     [ { id: 0, line_1: "" } ]
    })

    const [ selectedHH, updateSelectedHH ] = useState({})
    const [ showDebug, updateShowDebug ] = useState(false)
    const [ query, setQuery ] = useState("")
    const fuse = props.hhIndex

    const searchResults =
        fuse && query.trim().length > 1
            ? fuse.search(query).slice(0, 8)
            : [];

    let picklistOptions = mapHouseholdData(props.householdList)

    // Map each household record into a picklist option
    function mapHouseholdData(hhList) {
        console.debug(`Starting mapHouseholdData with ${hhList.length} HHs`)

        if (!Array.isArray(hhList)) {
            console.error("Invalid household list:", hhList);
            return [];
        }

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
        console.debug("Start of handleHouseholdChange(event)")
        // console.debug(`hhId: ${event.target.value}`)
        // Update the id, nickname, and address count for the selected household
        updateSelection({
            ...selection,
            householdId:  event.target.value,
            addressCount: props.addressList.filter((address) => address.household_id.toString() === event.target.value).length,
            addrList:     props.addressList.filter((address) => address.household_id.toString() === event.target.value)
        })

        // Update the household data for the selected object
        updateSelectedHH(props.householdList.filter((hh) => hh.id.toString() === event.target.value.toString())[0])
    }

    function handleSearchResultSelectionChange(searchSelectionId) {
        // Update the id, nickname, and address count for the selected household
        // console.debug("Start of handleSearchResultSelectionChange()")
        // console.debug(`hhId: ${searchSelectionId}`)
        updateSelection({
            ...selection,
            householdId:  searchSelectionId,
            addressCount: props.addressList.filter((address) => address.household_id.toString() === searchSelectionId).length,
            addrList:     props.addressList.filter((address) => address.household_id.toString() === searchSelectionId)
        })

        // Update the household data for the selected object
        updateSelectedHH(props.householdList.filter((hh) => hh.id.toString() === searchSelectionId.toString())[0])
    }

    function handleSearchQueryChange(event) {
        setQuery(event.target.value)
    }

    // When householdList changes, update state and the list of picklist options
    useEffect(() => {
        console.debug("List of households was updated by HouseholdContainer.useEffect")

        // picklistOptions = mapHouseholdData(props.householdList)

        // Initialize the selected id to the first household in the list
        if (props.householdList[0].nickname) {
            updateSelection({
                householdId:  props.householdList[0].id,
                addressCount: props.addressList.filter((address) => address.household_id.toString() === props.householdList[0].id).length,
                addrList:     props.addressList.filter((address) => address.household_id.toString() === props.householdList[0].id)
            })

            // Fill HHInfo for the first item in the list
            updateSelectedHH(props.householdList[0])
        }
    }, [ props.householdList, props.addressList ])

    return (
        <section>
            {/*<div className="title">Households</div>*/}

            <div className="content">
                <div className="column-container">
                    <div className="col">
                        {/*<span className="subtitle">Select Household</span>*/}
                        <h3>Select Household</h3>
                        {props.householdList.length > 1 && (
                            <div className="hh-search-box-container">
                                <input
                                    type="text"
                                    id="household-search-box"
                                    name="hhSearchBox"
                                    className="hh-search-box"
                                    placeholder="Search by name(s), including kids & pets"
                                    value={query}
                                    onChange={handleSearchQueryChange}
                                    autoFocus={true}
                                />

                                {searchResults.length > 0 && (
                                    <ul className="hh-search-results">
                                        {searchResults.map(({item: result}) => {
                                                // console.debug(`Search result item: ${JSON.stringify(item)}`)
                                                // console.debug(`Selection: ${JSON.stringify(selection)}`)
                                                return (
                                                    <li
                                                        key={`search-result-${result.id}`}
                                                        id={`search-result-${result.id}`}
                                                        className="hh-search-result-container"
                                                        value={result.id}
                                                        onClick={() => handleSearchResultSelectionChange(result.id)}
                                                    >
                                                        <HouseholdSearchResult
                                                            key={result.id}
                                                            nickname={result.nickname}
                                                            first_names={result.first_names}
                                                            surname={result.surname}
                                                            kids={result.kids}
                                                            pets={result.pets}
                                                            known_from={result.known_from}
                                                            relationship={result.relationship}
                                                            relationship_type={result.relationship_type}
                                                        />
                                                    </li>
                                                )
                                            }
                                        )}
                                    </ul>
                                )}
                            </div>
                        )}

                        <span className="selection-box">
                            <select
                                name="householdId"
                                id="households-selection-box"
                                className="selection-box"
                                size={Math.min(props.householdList.length, 18)}
                                value={selection.householdId}
                                onChange={handleHouseholdChange}
                                required={false}
                            >
                                {picklistOptions}
                            </select>
                            <div className="label-checkbox-container">
                                <input
                                    type="checkbox"
                                    id="hh-show-debug"
                                    name="showDebug"
                                    checked={showDebug}
                                    onChange={() => updateShowDebug(!showDebug)}
                                    className="input-checkbox"
                                />

                                <label
                                    htmlFor="hh-show-debug"
                                    className="label-checkbox"
                                >Show debug info</label>
                            </div>
                        </span>

                        <p className="debug" hidden={!showDebug}>
                            hh_id: {"\t" + selection.householdId} <br />
                            nick: {"\t" + selectedHH.nickname} <br />
                            addresses: {"\t" + selection.addressCount} <br /><br />
                            addr0Id: {selection.addrList[0] ? selection.addrList[0].id : "..."}
                            <br />
                            addr0Street: {selection.addrList[0] ? selection.addrList[0].line_1 : "..."}
                            <br /><br />
                            addr1Id: {selection.addrList[1] ? selection.addrList[1].id : "n/a"}
                            <br />
                            addr1Street: {selection.addrList[1] ? selection.addrList[1].line_1 : "n/a"}
                            <br />
                        </p>
                    </div>
                    <div className="col">
                        <h3>Household Info</h3>
                        <HHInfo
                            id={selectedHH.id}
                            nickname={selectedHH.nickname}
                            firstNames={selectedHH.first_names || ""}
                            surname={selectedHH.surname || ""}
                            addressTo={selectedHH.address_to || ""}
                            formalName={selectedHH.formal_name || ""}
                            relationship={selectedHH.relationship || ""}
                            relationshipType={selectedHH.relationship_type || ""}
                            familySide={selectedHH.family_side || ""}
                            kids={selectedHH.kids || ""}
                            pets={selectedHH.pets || ""}
                            shouldReceiveHolidayCard={selectedHH.should_receive_holiday_card || ""}
                            knownFrom={selectedHH.known_from || ""}
                            isRelevant={selectedHH.is_relevant || ""}
                            createdDate={new Date(selectedHH.created_date).toLocaleString() || ""}
                            lastModified={new Date(selectedHH.last_modified).toLocaleString() || ""}
                            notes={selectedHH.notes || ""}
                            updateHHData={props.updateHHData}
                            refreshDataFromDB={props.refreshDataFromDB}
                        />
                    </div>
                </div>

                <div className="column-container">
                    <div className="col">
                        <h3>{`${selection.addressCount > 1 ? "Addresses" : "Address"} for ${selectedHH.nickname}:`}</h3>
                        <AddressArray
                            householdId={selection.householdId}
                            householdNickname={selectedHH.nickname}
                            addressList={props.addressList}
                            // refreshDataFromDB={props.refreshDataFromDB}
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
