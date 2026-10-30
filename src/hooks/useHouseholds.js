import { useEffect, useMemo, useState, useCallback, useRef } from "react"
import { fetchHouseholdsAndAddresses } from "../services/householdsService"
import { refineErrorWithHealthCheck } from "../services/apiFetch"
import { defaultAddress, defaultHousehold } from "../data/defaultData"
import Fuse from "fuse.js"

export default function useHouseholds() {
    const [addressData, setAddressData] = useState([defaultAddress])
    const [householdData, setHouseholdData] = useState([defaultHousehold])
    const [selectedHH, setSelectedHH] = useState(-1)
    const [loading, setLoading] = useState(true)

    // Banner state: null while healthy, "retrying" during back-off, "error" after giving up
    const [apiStatus, setApiStatus] = useState(null)
    const [typedError, setTypedError] = useState(null)
    const [retryAttempt, setRetryAttempt] = useState(0)
    const [retryAt, setRetryAt] = useState(null)  // epoch ms of next scheduled retry

    const retryCountRef = useRef(0)
    const isMountedRef = useRef(true)
    const retryTimeoutRef = useRef(null)

    const BASE_DELAY = 1000  // 1 second
    const MAX_RETRIES = 5    // delays: 1s, 2s, 4s, 8s, 16s

    const refreshAllData = useCallback(async () => {
        // Don't flash the loading state on retries — only on the initial bootstrap
        if (retryCountRef.current === 0) setLoading(true)

        try {
            const { addresses, households } = await fetchHouseholdsAndAddresses()

            if (!isMountedRef.current) return

            setAddressData(addresses)
            setHouseholdData(households)
            setApiStatus(null)
            setTypedError(null)
            setRetryAttempt(0)
            setRetryAt(null)
            retryCountRef.current = 0

            setSelectedHH((prev) => {
                if (prev === -1 && households.length) {
                    return households[0].id
                }
                return prev
            })
        } catch (err) {
            console.error(`Error fetching data: ${err?.message || err}`)
            if (!isMountedRef.current) return

            // err is a typed object from apiFetch; guard against unexpected plain Errors
            const typed = (err && err.kind)
                ? err
                : { kind: "http_error", status: null, endpoint: "unknown", timestamp: new Date().toISOString(), message: String(err) }

            retryCountRef.current += 1
            setRetryAttempt(retryCountRef.current)

            if (retryCountRef.current <= MAX_RETRIES) {
                const delay = Math.min(BASE_DELAY * Math.pow(2, retryCountRef.current - 1), 1800 * 1000)
                const nextRetryAt = Date.now() + delay
                console.debug(`Fetch attempt #${retryCountRef.current} failed at ${new Date().toLocaleString()}, retrying in ${delay / 1000}s at ${new Date(nextRetryAt).toLocaleTimeString()}`)

                setApiStatus("retrying")
                setTypedError(typed)
                setRetryAt(nextRetryAt)

                clearTimeout(retryTimeoutRef.current)
                retryTimeoutRef.current = setTimeout(() => {
                    if (isMountedRef.current) refreshAllData()
                }, delay)

            } else {
                console.error("Max retries reached, giving up.")

                // One silent health check to get a more specific error message if the server is up
                const refined = await refineErrorWithHealthCheck(typed)
                if (!isMountedRef.current) return

                setApiStatus("error")
                setTypedError(refined)
                setRetryAt(null)
            }
        } finally {
            if (isMountedRef.current) setLoading(false)
        }
    }, [])

    // Restart the fetch cycle from scratch — called by the Retry button in DivStatusBanner
    const retryFetch = useCallback(() => {
        clearTimeout(retryTimeoutRef.current)
        retryCountRef.current = 0
        setApiStatus(null)
        setTypedError(null)
        setRetryAttempt(0)
        setRetryAt(null)
        refreshAllData()
    }, [refreshAllData])

    useEffect(() => {
        /**
         * On mount:
         *  - mark this component as mounted so async refresh logic can safely update state
         *  - trigger the initial data fetch
         *
         * On unmount:
         *  - mark the component as unmounted so any in-flight async operations
         *    (like refresh retries or pending fetches) will not attempt to update state.
         *
         * This avoids React warnings about setting state on an unmounted component.
         */
        isMountedRef.current = true

        // We intentionally ignore the returned promise because retry logic & error handling are handled inside refreshAllData()
        void refreshAllData()

        return () => {
            isMountedRef.current = false
            clearTimeout(retryTimeoutRef.current)
        }
    }, [refreshAllData])

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
                { name: "notes", weight: 0.15 },
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

        // console.debug(`Max hh_id: ${maxHouseholdId}; max address_id: ${maxAddressId}.`)
        return {
            nextAddressId: maxAddressId + 1,
            nextHouseholdId: maxHouseholdId + 1
        }
    }, [addressData, householdData])

    return {
        addressData, householdData, selectedHH, setSelectedHH, setAddressData, setHouseholdData,
        refresh: refreshAllData, retryFetch, hhIndex, nextIds,
        loading, apiStatus, typedError, retryAttempt, retryAt
    }
}
