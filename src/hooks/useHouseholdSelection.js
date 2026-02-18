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
        householdId: null,
        addressCount: 0,
        addrList: []
    })

    const [insertNewHouseholdMode, setInsertNewHouseholdMode] = useState(false)
    const [showDebug, setShowDebug] = useState(false)

    // --- Search state ---
    const [query, setQuery] = useState("")
    const [activeIndex, setActiveIndex] = useState(-1)

    // --- Derive selected household from selection + list (single source of truth) ---
    const selectedHH = useMemo(() => {
        if (selection.householdId == null) return null
        return householdList.find((hh) => hh.id === selection.householdId) || null
    }, [householdList, selection.householdId])

    // --- Search results using Fuse ---
    const maxSearchResults = 5
    const searchResults = useMemo(() => {
        if (!hhIndex) return []
        if (query.trim().length < 2) return []
        return hhIndex.search(query).slice(0, maxSearchResults)
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
            // Allow explicit "clear selection" by passing null/undefined
            if (hhId == null) {
                setSelection({
                    householdId: null,
                    addressCount: 0,
                    addrList: []
                })
                return
            }

            const numericId = Number(hhId)
            const addrListForHH = addressList.filter((addr) => addr.household_id === numericId)

            setSelection({
                householdId: numericId,
                addressCount: addrListForHH.length,
                addrList: addrListForHH
            })
        },
        [addressList]
    )

    const handleHouseholdChange = useCallback(
        (event) => {
            const raw = event.target.value
            // If you ever add a blank option like <option value="">Select...</option>
            if (raw === "" || raw == null) {
                handleSearchResultSelectionChange(null)
                return
            }

            const hhId = Number(raw)
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

    // Reconcile selection when underlying lists change.
    // Never auto-select a default household.
    useEffect(() => {
        // If nothing selected, nothing to reconcile
        if (selection.householdId == null) return

        const selectedId = selection.householdId
        const exists = householdList.some((hh) => hh.id === selectedId)

        if (!exists) {
            setSelection({
                householdId: null,
                addressCount: 0,
                addrList: []
            })
            return
        }

        // Update derived address list/count if addresses changed
        const addrListForHH = addressList.filter((addr) => addr.household_id === selectedId)

        // Avoid useless state updates if nothing changed
        setSelection((prev) => {
            if (prev.householdId !== selectedId) return prev
            if (prev.addressCount === addrListForHH.length && prev.addrList === addrListForHH) {
                return prev
            }

            return {
                householdId: selectedId,
                addressCount: addrListForHH.length,
                addrList: addrListForHH
            }
        })
    }, [householdList, addressList, selection.householdId])

    // Reset activeIndex when query changes
    useEffect(() => {
        setActiveIndex(-1)
    }, [query])

    return {
        selectedHH, selection, insertNewHouseholdMode, query, activeIndex, searchResults, picklistOptions, showDebug,
        handlers: {
            handleHouseholdChange,
            handleSearchQueryChange,
            handleKeyboardInput,
            handleSearchResultSelectionChange,
            handleNewRecordMode,
            updateOneHousehold,
            insertNewHousehold,
            toggleDebug: () => setShowDebug((prev) => !prev)
        }
    }
}
