import NavBar from "./components/NavBar";
import Footer from "./components/Footer";
import Households from "./components/sections/Households";
import "./styles/styles.css";
import "./styles/sections.css";
import { api } from "./data/endpoints";
import { defaultAddress, defaultHousehold } from "./data/defaultData";
import { useState, useEffect, useMemo } from "react";
import Fuse from "fuse.js";

export default function App() {
    const [ addressData, updateAddressData ] = useState([ defaultAddress ])
    const [ householdData, updateHouseholdData ] = useState([ defaultHousehold ])
    const [ selectedHH, updateSelectedHH ] = useState(-1)
    // const [ nextIds, updateNextIds ] = useState({ nextAddressId: 0, nextHouseholdId: 0 })

    // Declare an async function for retrieving data
    async function getAllAddressesAndHouseholds() {
        try {
            console.debug(`Calling endpoint: ${api.addresses.all}`)

            // Make the GET requests
            const addressListRequest = await fetch(api.addresses.all)
            const householdListRequest = await fetch(api.households.all)

            // Parse the response, which should be a list of object literals
            const addressListResponse = await addressListRequest.json()
            const householdListResponse = await householdListRequest.json()

            // Update local state
            updateAddressData(addressListResponse)
            updateHouseholdData(householdListResponse)

            try {
                if (selectedHH === -1) {
                    updateSelectedHH(householdData[0].id)
                }
            } catch (error) {
                updateSelectedHH(-1)
            }

        } catch (error) {
            console.error(`Error retrieving (or parsing) address list: ${error}`)
        }
    }

    // Retrieve and store data from the database when the App function is loaded
    useEffect(() => {
        console.info("Retrieving list of addresses & households via App.useEffect")

        // Call the async function declared above
        getAllAddressesAndHouseholds()
            .then(() => console.log("Request within App.useEffect.getData() completed!"))
            .catch((error) => console.error(`Error in App.useEffect.getData(): ${error}`))
            .finally(() => console.debug("End of App.useEffect.getData()"))
    }, [])

    // Create & update the searchable household index when householdData changes
    console.info(`Creating a search index for ${householdData.length} households.`)
    const hhIndex = useMemo(() => {
        console.debug("Start of the search index useMemo function.")
        if (!householdData || householdData.length === 0) {
            console.debug("Not creating a search index.")
            return null
        }

        // Normalize the household data, since many fields can be null
        const normalizedHouseholds =  householdData.map((hh) => ({
            ...hh,
            kids: hh.kids || "",
            pets: hh.pets || "",
            known_from: hh.known_from || "",
            relationship: hh.relationship || "",
            relationship_type: hh.relationship_type || "",
            family_side: hh.family_side || ""
        }))

        return new Fuse(normalizedHouseholds, {
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
        const maxAddressId =
            addressData && addressData.length
                ? addressData.reduce(
                    (max, addr) => (addr.id > max ? addr.id : max),
                    -Infinity
                )
                : null

        const maxHouseholdId =
            householdData && householdData.length
                ? householdData.reduce(
                    (max, hh) => (hh.id > max ? hh.id : max),
                    -Infinity
                )
                : null

        console.debug(`Max hh_id: ${maxHouseholdId}; max address_id: ${maxAddressId}.`)
        // updateNextIds({
        //     nextAddressId:      maxAddressId + 1,
        //     nextHouseholdId:    maxHouseholdId + 1,
        // })

        return {
            nextAddressId:      maxAddressId + 1,
            nextHouseholdId:    maxHouseholdId + 1,
        }
    }, [addressData, householdData])

    return (
        <div className="app-container">
            <header className="header-container">
                <NavBar />
            </header>

            <main className="app-content">
                <Households
                    householdList={householdData}
                    addressList={addressData}
                    updateHHData={updateHouseholdData}
                    updateAddressData={updateAddressData}
                    refreshDataFromDB={getAllAddressesAndHouseholds}
                    hhIndex={hhIndex}
                    nextIds={nextIds}
                />
            </main>

            <footer className="footer-container">
                <Footer />
            </footer>
        </div>
    )
}
