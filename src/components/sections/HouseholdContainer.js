import React, { useState, useEffect } from "react";
import PicklistOption from "./household/PicklistOption";
import AddressArray from "./address/AddressArray";
import { defaultAddress, defaultHousehold } from "../../data/defaultData";
import HHInfo from "./household/HHInfo";
import HouseholdSearchResult from "./household/HHSearchResult";
import PicklistOptionsList from "./household/PicklistOptionsList";

export default function HouseholdContainer(props) {
    const [ selection, updateSelection ] = useState({
        // TODO: Figure out why I have to hard-code a valid id here
        householdId:  props.householdList[0].id ? props.householdList[0].id : 84,
        addressCount: 0,
        addrList:     [ { id: 0, line_1: "" } ]
    })

    // Core functionality vars
    const [ selectedHH, updateSelectedHH ] = useState(props.householdList[0])
    const [ showDebug, updateShowDebug ] = useState(false)
    const [ insertNewRecordMode, updateInsertNewRecordMode ] = useState(false)

    // Search vars
    const [ query, setQuery ] = useState("")
    const [ activeIndex, setActiveIndex ] = useState(-1)
    const fuse = props.hhIndex
    const searchResults =
        fuse && query.trim().length > 1
            ? fuse.search(query).slice(0, 8)
            : [];

    // Build the picklist options list
    // TODO: Move this picklist to its own component
    let picklistOptions = mapHouseholdData(props.householdList)

    // Map each household record into a picklist option
    function mapHouseholdData(hhList) {
        console.debug(`Starting mapHouseholdData with ${hhList.length} HHs`)

        if (!Array.isArray(hhList)) {
            console.error("Invalid household list:", hhList);
            return []
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

    // Update the id, nickname, and address count for the selected household
    function handleSearchResultSelectionChange(searchSelectionId) {
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

    function handleKeyboardInput(event) {
        if (!searchResults.length) return;

        switch (event.key) {
            case "ArrowDown":
                event.preventDefault()
                setActiveIndex((i) =>
                    i < searchResults.length - 1 ? i + 1 : 0
                );
                break

            case "ArrowUp":
                event.preventDefault()
                setActiveIndex((i) =>
                    i > 0 ? i - 1 : searchResults.length - 1
                );
                break

            case "Enter":
                if (activeIndex >= 0) {
                    event.preventDefault()
                    props.onSelect(searchResults[activeIndex].item)
                }
                break

            case "Escape":
                setQuery("")
                setActiveIndex(-1)
                break

            default:
                break
        }
    }

    // When new household info is saved, update the household list to reflect this
    function updateOneHousehold(updatedHousehold) {
        let newHHList = []

        try {
            // Create a new array with all households except the one being updated
            newHHList = props.householdList.filter((hh) => hh.id.toString() !== updatedHousehold.id.toString())
        } catch(e) {
            // New
        }

        // Append the updated household to the array
        newHHList.push(updatedHousehold)

        // Update the list of households
        props.updateHHData(newHHList)
    }

    function insertNewHousehold(newHousehold) {
        // Append the updated household to the array
        let newHHList = props.householdList.push(newHousehold)

        // Update the list of households
        props.updateHHData(newHHList)
    }

    function handleNewRecordMode(event) {
        updateInsertNewRecordMode(!insertNewRecordMode)
    }

    // When householdList changes, update state and the list of picklist options
    useEffect(() => {
        console.debug("List of households was updated by HouseholdContainer.useEffect")

        // picklistOptions = mapHouseholdData(props.householdList)

        // Initialize the selected id to the selected household
        if (props.householdList[0].nickname) {
            updateSelection({
                // householdId:  props.householdList[0].id,
                householdId: selection.householdId,
                addressCount: props.addressList.filter((address) => address.household_id.toString() === selection.householdId.toString()).length,
                addrList:     props.addressList.filter((address) => address.household_id.toString() === selection.householdId.toString())
            })

            // Fill HHInfo for the selected household
            updateSelectedHH(props.householdList.filter((hh) => hh.id.toString() === selection.householdId.toString())[0])
            // updateSelectedHH(selection.householdId)
        } else {
            console.log("props.hhList[0].nickname is undefined")
            // updateSelectedHH([defaultHousehold])
        }
    }, [ props.householdList, props.addressList ])

    // Reset the active selection when the search query changes
    useEffect(() => {
        setActiveIndex(-1);
    }, [query]);

    return (
        <section>
            <div className="content">
                <div className="column-container">
                    <div className="col">
                        <h3>Select Household</h3>

                        {/* TODO: Move the search box & results to their own components */}
                        {props.householdList.length > 1 && (
                            <div className="hh-search-box-container">
                                <input
                                    type="text"
                                    id="household-search-box"
                                    name="hhSearchBox"
                                    className="hh-search-box"
                                    placeholder="Search by name(s), including kids & pets"
                                    value={query}
                                    tabIndex={0}
                                    onChange={handleSearchQueryChange}
                                    onKeyDown={handleKeyboardInput}
                                    autoFocus={!insertNewRecordMode}
                                    disabled={insertNewRecordMode}
                                />

                                {searchResults.length > 0 && (
                                    <ul className="hh-search-results">
                                        {searchResults.map(({item: result, matches}) => {
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
                                                            matches={matches}
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
                                disabled={insertNewRecordMode}
                            >
                                <PicklistOptionsList
                                    elementList={picklistOptions}
                                />
                            </select>

                            <div className="label-checkbox-container">
                                <input
                                    type="checkbox"
                                    id="hh-show-debug"
                                    name="showDebug"
                                    checked={showDebug}
                                    onChange={() => updateShowDebug(!showDebug)}
                                    className="input-checkbox"
                                    disabled={insertNewRecordMode}
                                />

                                <label
                                    htmlFor="hh-show-debug"
                                    className="label-checkbox"
                                >Show debug info</label>
                            </div>

                            <button
                                type="button"
                                name="insertNewHH"
                                className="btn btn-submit"
                                onClick={handleNewRecordMode}
                            >Add New Household</button>
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
                        {insertNewRecordMode ?
                            <HHInfo
                                id={0}
                                nickname={""}
                                firstNames={""}
                                surname={""}
                                addressTo={""}
                                formalName={""}
                                relationship={""}
                                relationshipType={""}
                                familySide={""}
                                knownFrom={""}
                                kids={""}
                                pets={""}
                                shouldReceiveHolidayCard={true}
                                isRelevant={true}
                                createdDate={new Date().toLocaleString()}
                                lastModified={new Date().toLocaleString()}
                                notes={""}
                                updateOneHousehold={updateOneHousehold}
                                // insertNewHousehold={insertNewHousehold}
                                insertNewRecordMode={insertNewRecordMode}
                                updateInsertNewRecordMode={updateInsertNewRecordMode}
                                updateAddressData={props.updateAddressData}
                                refreshDataFromDB={props.refreshDataFromDB}
                                nextIds={props.nextIds}
                            />
                            : <HHInfo
                                id={selectedHH.id}
                                nickname={selectedHH.nickname}
                                firstNames={selectedHH.first_names || ""}
                                surname={selectedHH.surname || ""}
                                addressTo={selectedHH.address_to || ""}
                                formalName={selectedHH.formal_name || ""}
                                relationship={selectedHH.relationship || ""}
                                relationshipType={selectedHH.relationship_type || ""}
                                familySide={selectedHH.family_side || ""}
                                knownFrom={selectedHH.known_from || ""}
                                kids={selectedHH.kids || ""}
                                pets={selectedHH.pets || ""}
                                shouldReceiveHolidayCard={selectedHH.should_receive_holiday_card === null ? false : selectedHH.should_receive_holiday_card}
                                isRelevant={selectedHH.is_relevant === null ? false : selectedHH.is_relevant}
                                createdDate={new Date(selectedHH.created_date).toLocaleString() || ""}
                                lastModified={new Date(selectedHH.last_modified).toLocaleString() || ""}
                                notes={selectedHH.notes || ""}
                                updateOneHousehold={updateOneHousehold}
                                // insertNewHousehold={insertNewHousehold}
                                insertNewRecordMode={insertNewRecordMode}
                                updateInsertNewRecordMode={updateInsertNewRecordMode}
                                updateAddressData={props.updateAddressData}
                                refreshDataFromDB={props.refreshDataFromDB}
                                nextIds={props.nextIds}
                            />
                        }
                    </div>
                </div>

                <div className="column-container">
                    <div className="col">
                        <h3>{`${selection.addressCount > 1 ? "Addresses" : "Address"} ${selectedHH.nickname === null ? "" : `for ${selectedHH.nickname}`}:`}</h3>
                        <AddressArray
                            householdId={selection.householdId}
                            householdNickname={selectedHH.nickname}
                            addressList={props.addressList}
                            insertNewRecordMode={insertNewRecordMode}
                            // refreshDataFromDB={props.refreshDataFromDB}
                        />
                    </div>
                </div>
            </div>

        </section>
    )
}

HouseholdContainer.defaultProps = {
    householdList:  [ defaultHousehold ],
    addressList:    [ defaultAddress ],
    nextIds:        { nextAddressId: 0, nextHouseholdId: 0 }
}
