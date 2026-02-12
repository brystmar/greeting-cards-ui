import { useState, useEffect, useMemo, useCallback } from "react"
import { defaultHousehold } from "../data/defaultData"

export default function useHouseholdSelection(
    householdList = [defaultHousehold],
    addressList = [],
    hhIndex = null,
    nextIds = { nextAddressId: 0, nextHouseholdId: 0 },
    updateHHData,
    updateAddressData,
    refreshDataFromDB
) {
    // --- Selection & modes ---
    const [selection, setSelection] = useState({
        householdId: householdList[0]?.id || nextIds.nextHouseholdId,
        addressCount: 0,
        addrList: []
    })
    const [selectedHH, setSelectedHH] = useState(householdList[0] || defaultHousehold)
    const [insertNewHouseholdMode, setInsertNewHouseholdMode] = useState(false)
    const [showDebug, setShowDebug] = useState(false)

    // --- Search state ---
    const [query, setQuery] = useState("")
    const [activeIndex, setActiveIndex] = useState(-1)

    // --- Search results using Fuse ---
    const searchResults = useMemo(() => {
        if (!hhIndex) return []
        if (query.trim().length < 2) return []
        return hhIndex.search(query).slice(0, 8)
    }, [hhIndex, query])

    // --- Picklist options (kept for compatibility; you can remove if unused) ---
    const picklistOptions = useMemo(() => {
        return householdList
            .slice()
            .sort((a, b) =>
                (a.nickname || "").toLowerCase().localeCompare((b.nickname || "").toLowerCase())
            )
            .map((hh) => ({ id: hh.id, nickname: hh.nickname }))
    }, [householdList])

    const handleSearchResultSelectionChange = useCallback(
        (hhId) => {
            const addrListForHH = addressList.filter((addr) => addr.household_id === hhId)

            setSelection({
                householdId: hhId,
                addressCount: addrListForHH.length,
                addrList: addrListForHH
            })

            setSelectedHH(householdList.find((hh) => hh.id === hhId) || defaultHousehold)
        },
        [householdList, addressList]
    )

    const handleHouseholdChange = useCallback(
        (event) => {
            const hhId = Number(event.target.value)
            handleSearchResultSelectionChange(hhId)
        },
        [handleSearchResultSelectionChange]
    )

    const handleSearchQueryChange = useCallback((event) => {
        setQuery(event.target.value)
        setActiveIndex(-1)
    }, [])

    const handleKeyboardInput = useCallback(
        (event) => {
            if (!searchResults.length) return

            switch (event.key) {
                case "ArrowDown":
                    event.preventDefault()
                    setActiveIndex((i) => (i < searchResults.length - 1 ? i + 1 : 0))
                    break

                case "ArrowUp":
                    event.preventDefault()
                    setActiveIndex((i) => (i > 0 ? i - 1 : searchResults.length - 1))
                    break

                case "Enter":
                    if (activeIndex >= 0) {
                        event.preventDefault()
                        const selectedId = searchResults[activeIndex].item.id
                        handleSearchResultSelectionChange(selectedId)
                    }
                    break

                case "Escape":
                    setQuery("")
                    setActiveIndex(-1)
                    break

                default:
                    // required for lint + safe no-op for other keys
                    break
            }
        },
        [searchResults, activeIndex, handleSearchResultSelectionChange]
    )

    const handleNewRecordMode = useCallback(() => {
        setInsertNewHouseholdMode((prev) => !prev)
    }, [])

    const updateOneHousehold = useCallback(
        (updatedHH) => {
            const newHHList = householdList.filter((hh) => hh.id !== updatedHH.id)
            newHHList.push(updatedHH)
            updateHHData(newHHList)
        },
        [householdList, updateHHData]
    )

    const insertNewHousehold = useCallback(
        (newHH) => {
            const newHHList = [...householdList, newHH]

            const newAddress = {
                id: newHH.address_id,
                household_id: newHH.id,
                line_1: "",
                line_2: "",
                city: "",
                state: "",
                zip: "",
                country: "United States",
                full_address: "",
                is_current: true,
                is_likely_to_change: false,
                mail_the_card_to_this_address: true,
                created_date: newHH.created_date,
                last_modified: newHH.last_modified,
                notes: ""
            }

            const newAddressList = [...addressList, newAddress]

            updateHHData(newHHList)
            updateAddressData(newAddressList)
        },
        [householdList, addressList, updateHHData, updateAddressData]
    )

    // Initialize / reconcile selection when list data changes.
    // This version avoids referencing selection in the dependency list by using a functional setState.
    useEffect(() => {
        if (!householdList.length) return

        setSelection((prev) => {
            const preferredId = prev.householdId
            const exists = householdList.some((hh) => hh.id === preferredId)

            const hhId = exists ? preferredId : householdList[0].id
            const addrListForHH = addressList.filter((addr) => addr.household_id === hhId)

            setSelectedHH(householdList.find((hh) => hh.id === hhId) || defaultHousehold)

            return {
                householdId: hhId,
                addressCount: addrListForHH.length,
                addrList: addrListForHH
            }
        })
    }, [householdList, addressList])

    // Reset activeIndex when query changes
    useEffect(() => {
        setActiveIndex(-1)
    }, [query])

    return {
        selectedHH,
        selection,
        insertNewHouseholdMode,
        query,
        activeIndex,
        searchResults,
        picklistOptions,
        handlers: {
            handleHouseholdChange,
            handleSearchQueryChange,
            handleKeyboardInput,
            handleSearchResultSelectionChange,
            handleNewRecordMode,
            updateOneHousehold,
            insertNewHousehold,
            toggleDebug: () => setShowDebug((prev) => !prev)
        },
        showDebug
    }
}
