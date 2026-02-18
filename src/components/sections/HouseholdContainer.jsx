import { useEffect, useRef } from "react"
import useHouseholdSelection from "../../hooks/useHouseholdSelection"
import HHInfo from "./household/HHInfo"
import HouseholdSearchResult from "./household/HHSearchResult"
import PicklistOptionsList from "./household/PicklistOptionsList"
import AddressArray from "./address/AddressArray"
import "../../styles/search-elements.css"

export default function HouseholdContainer({
                                               householdList,
                                               addressList,
                                               updateHHData,
                                               updateAddressData,
                                               refreshDataFromDB,
                                               hhIndex,
                                               nextIds
                                           }) {
    const {
        selectedHH,
        selection,
        insertNewHouseholdMode,
        query,
        activeIndex,
        searchResults,
        handlers,
        showDebug
    } = useHouseholdSelection(householdList, addressList, hhIndex, nextIds, updateHHData,
        updateAddressData, refreshDataFromDB)

    const picklistSize = Math.min(householdList.length, 19)

    const isSearchEnabled = householdList.length > 1 && !insertNewHouseholdMode
    const showSearchResults = isSearchEnabled && searchResults.length > 0

    const addressFor = insertNewHouseholdMode || !selectedHH?.nickname
        ? "Address for ..."
        : selection.addressCount > 1
            ? `Addresses for ${selectedHH.nickname}:`
            : `Address for ${selectedHH.nickname}:`

    const addButtonText = insertNewHouseholdMode ? "Cancel" : "Add New Household"

    const hhInfoProps = insertNewHouseholdMode
        ? {
            id: nextIds.nextHouseholdId,
            nickname: "",
            firstNames: "",
            surname: "",
            addressTo: "",
            formalName: "",
            relationship: "",
            relationshipType: "",
            familySide: "",
            knownFrom: "",
            kids: "",
            pets: "",
            shouldReceiveHolidayCard: true,
            isRelevant: true,
            createdDate: new Date().toLocaleString(),
            lastModified: new Date().toLocaleString(),
            notes: ""
        }
        : {
            id: selectedHH?.id ?? 0,
            nickname: selectedHH?.nickname,
            firstNames: selectedHH?.first_names,
            surname: selectedHH?.surname,
            addressTo: selectedHH?.address_to,
            formalName: selectedHH?.formal_name,
            relationship: selectedHH?.relationship,
            relationshipType: selectedHH?.relationship_type,
            familySide: selectedHH?.family_side,
            knownFrom: selectedHH?.known_from,
            kids: selectedHH?.kids,
            pets: selectedHH?.pets,
            shouldReceiveHolidayCard: Boolean(selectedHH?.should_receive_holiday_card),
            isRelevant: Boolean(selectedHH?.is_relevant),
            createdDate: selectedHH?.created_date ? new Date(selectedHH.created_date).toLocaleString() : "",
            lastModified: selectedHH?.last_modified ? new Date(selectedHH.last_modified).toLocaleString() : "",
            notes: selectedHH?.notes
        }

    const searchResultItems = showSearchResults
        ? searchResults.map(({ item, matches }, index) => (
            <li
                key={item.id}
                id={`search-result-${item.id}`}
                className={`hh-search-result-container ${index === activeIndex ? "active" : ""}`}
                onClick={() => handlers.handleSearchResultSelectionChange(item.id)}
            >
                <HouseholdSearchResult
                    nickname={item.nickname}
                    first_names={item.first_names}
                    surname={item.surname}
                    kids={item.kids}
                    pets={item.pets}
                    known_from={item.known_from}
                    relationship={item.relationship}
                    relationship_type={item.relationship_type}
                    matches={matches}
                />
            </li>
        ))
        : null

    const { handleSearchResultSelectionChange } = handlers
    const lastAutoSelectedIdRef = useRef(null)

    useEffect(() => {
            // When only 1 record matches a search query, automatically update the picklist selection to that record
            if (!showSearchResults) return

            const trimmedQuery = query.trim()
            const minChars = 2
            const debounceMs = 500

            // Only auto-select after the user has typed enough to be intentional
            if (trimmedQuery.length < minChars) {
                lastAutoSelectedIdRef.current = null
                return
            }

            // Only auto-select when exactly one match exists
            if (searchResults.length !== 1) {
                lastAutoSelectedIdRef.current = null
                return
            }

            const onlyId = searchResults[0].item.id

            // Skip if already selected, or we've already auto-selected this id for this query state
            if (selection.householdId === onlyId) return
            if (lastAutoSelectedIdRef.current === onlyId) return

            const timer = setTimeout(() => {
                lastAutoSelectedIdRef.current = onlyId
                handleSearchResultSelectionChange(onlyId)
            }, debounceMs)

            return () => clearTimeout(timer)
        }, [showSearchResults, query, searchResults, selection.householdId, handleSearchResultSelectionChange]
    )

    return (
        <section className="content">
            <div className="column-container">
                <div className="col">
                    <h3>Select Household</h3>

                    {householdList.length > 1 && (
                        <div className="hh-search-box-container">
                            <input
                                type="text"
                                id="household-search-box"
                                name="hhSearchBox"
                                className="hh-search-box"
                                placeholder="Search by name(s), including kids & pets"
                                value={query}
                                tabIndex={0}
                                onChange={handlers.handleSearchQueryChange}
                                onKeyDown={handlers.handleKeyboardInput}
                                autoFocus={!insertNewHouseholdMode}
                                disabled={!isSearchEnabled}
                            />

                            {showSearchResults && (
                                <ul className="hh-search-results">
                                    {searchResultItems}
                                </ul>
                            )}
                        </div>
                    )}

                    <span className="selection-box">
                        <select
                            name="householdId"
                            id="households-selection-box"
                            className="selection-box"
                            size={picklistSize}
                            value={selection.householdId || null}
                            onChange={handlers.handleHouseholdChange}
                            disabled={insertNewHouseholdMode}
                        >
                            <PicklistOptionsList elementList={householdList} />
                        </select>

                        <div className="label-checkbox-container">
                            <input
                                type="checkbox"
                                id="hh-show-debug"
                                name="showDebug"
                                checked={showDebug}
                                onChange={handlers.toggleDebug}
                                className="input-checkbox"
                                disabled={insertNewHouseholdMode}
                            />

                            <label htmlFor="hh-show-debug" className="label-checkbox">
                                Show debug info
                            </label>
                        </div>

                        <button
                            type="button"
                            name="insertNewHH"
                            className="btn btn-submit"
                            onClick={handlers.handleNewRecordMode}
                        >
                            {addButtonText}
                        </button>
                    </span>

                    <p className="debug" hidden={!showDebug}>
                        hh_id: {"\t" + (selection.householdId)} <br />
                        nick: {"\t" + (selectedHH?.nickname)} <br />
                        addresses: {"\t" + (selection.addressCount ?? 0)} <br /><br />
                        addr0Id: {selection.addrList?.[0] ? selection.addrList[0].id : "..."} <br />
                        addr0Street: {selection.addrList?.[0] ? selection.addrList[0].line_1 : "..."} <br /><br />
                        addr1Id: {selection.addrList?.[1] ? selection.addrList[1].id : "n/a"} <br />
                        addr1Street: {selection.addrList?.[1] ? selection.addrList[1].line_1 : "n/a"} <br />
                    </p>
                </div>

                <div className="col">
                    <h3>Household Info</h3>

                    <HHInfo
                        {...hhInfoProps}
                        insertNewHouseholdMode={insertNewHouseholdMode}
                        nextIds={nextIds}
                        updateOneHousehold={handlers.updateOneHousehold}
                        insertNewHousehold={handlers.insertNewHousehold}
                        updateInsertNewHouseholdMode={handlers.handleNewRecordMode}
                    />
                </div>
            </div>

            <div className="column-container">
                <div className="col">
                    <h3>{addressFor}</h3>

                    <AddressArray
                        householdId={selection.householdId}
                        householdNickname={selectedHH?.nickname}
                        addressList={addressList}
                        insertNewHouseholdMode={insertNewHouseholdMode}
                    />
                </div>
            </div>
        </section>
    )
}
