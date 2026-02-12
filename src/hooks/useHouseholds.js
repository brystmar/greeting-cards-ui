import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { fetchHouseholdsAndAddresses } from "../services/householdsService"
import { defaultAddress, defaultHousehold } from "../data/defaultData"
import Fuse from "fuse.js"

export default function useHouseholds() {
    const [addressData, setAddressData] = useState([defaultAddress])
    const [householdData, setHouseholdData] = useState([defaultHousehold])
    const [selectedHH, setSelectedHH] = useState(-1)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)

    const retryCountRef = useRef(0)
    const isMountedRef = useRef(true)

    const MAX_RETRIES = 100
    const BASE_DELAY = 5000  // Starting with 5 seconds

    const refresh = useCallback(async () => {
        try {
            setIsLoading(true)
            const { addresses, households } = await fetchHouseholdsAndAddresses()

            if (!isMountedRef.current) return

            setAddressData(addresses)
            setHouseholdData(households)
            setError(null)
            retryCountRef.current = 0  // Reset the retry counter on success

            if (selectedHH === -1 && households.length) {
                setSelectedHH(households[0].id)
            }
        } catch (err) {
            console.error(`Error fetching data: ${err}`)
            if (!isMountedRef.current) return

            setError(err.toString())
            retryCountRef.current += 1

            if (retryCountRef.current <= MAX_RETRIES) {
                const delay = BASE_DELAY * Math.pow(2, retryCountRef.current - 1) // exponential backoff
                console.debug(`Retrying fetch in ${delay}ms (attempt ${retryCountRef.current})`)
                setTimeout(() => {
                    if (isMountedRef.current) refresh()
                }, delay)
            } else {
                console.error("Max retries reached, giving up.")
            }
        } finally {
            if (isMountedRef.current) setIsLoading(false)
        }
    }, [selectedHH])

    //
    useEffect(() => {
        isMountedRef.current = true
        refresh()
        return () => {
            isMountedRef.current = false
        }
    }, [refresh])

    // Create & update the searchable household index when householdData changes
    const hhIndex = useMemo(() => {
        if (!householdData.length) return null

        const normalized = householdData.map((hh) => ({
            ...hh,
            kids: hh.kids || "",
            pets: hh.pets || "",
            known_from: hh.known_from || "",
            relationship: hh.relationship || "",
            relationship_type: hh.relationship_type || "",
            family_side: hh.family_side || ""
        }))

        return new Fuse(normalized, {
            keys: [
                { name: "nickname", weight: 0.35 },
                { name: "first_names", weight: 0.25 },
                { name: "surname", weight: 0.25 },
                { name: "kids", weight: 0.15 },
                { name: "pets", weight: 0.05 },
                { name: "known_from", weight: 0.05 },
                { name: "relationship", weight: 0.05 },
                { name: "relationship_type", weight: 0.05 }
            ],
            threshold: 0.25,
            ignoreLocation: true,
            minMatchCharLength: 2,
            includeMatches: true
        })
    }, [householdData])

    // Determine the next address_id and household_id to use when we need to insert a new record
    const nextIds = useMemo(() => {
        const maxAddressId = addressData.reduce((max, addr) => Math.max(max, addr.id), -1)
        const maxHouseholdId = householdData.reduce((max, hh) => Math.max(max, hh.id), -1)

        console.debug(`Max hh_id: ${maxHouseholdId}; max address_id: ${maxAddressId}.`)
        return {
            nextAddressId: maxAddressId + 1,
            nextHouseholdId: maxHouseholdId + 1
        }
    }, [addressData, householdData])

    return {
        addressData,
        householdData,
        selectedHH,
        setSelectedHH,
        setAddressData,
        setHouseholdData,
        refresh,
        hhIndex,
        nextIds,
        isLoading,
        error
    }
}
