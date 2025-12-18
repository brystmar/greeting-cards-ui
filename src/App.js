import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/sections/Home";
import Fuse from "fuse.js";
// import Cards from "./components/sections/Cards";
// import Events from "./components/sections/Events";
import './styles/styles.css';
import './styles/sections.css';
import React, { useState, useEffect, useMemo } from "react";
// import { Route, Routes } from "react-router-dom";
import { api } from "./data/endpoints";
import { defaultAddress, defaultHousehold } from "./data/defaultData";

export default function App() {
    const [ addressData, updateAddressData ] = useState([ defaultAddress ])
    const [ householdData, updateHouseholdData ] = useState([ defaultHousehold ])

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
        } catch (error) {
            console.error(`Error retrieving (or parsing) address list: ${error}`)
        }
    }

    // Retrieve and store data from the database when the App function is loaded
    useEffect(() => {
        // Call the async function declared above
        console.info("Retrieving list of addresses & households via App.useEffect")
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
            return null;
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
        }));

        return new Fuse(normalizedHouseholds, {
            keys: [
                { name: "nickname", weight: 0.35 },
                { name: "first_names", weight: 0.25 },
                { name: "surname", weight: 0.25 },
                { name: "kids", weight: 0.15 },
                { name: "pets", weight: 0.05 },
                { name: "known_from", weight: 0.05 },
                { name: "relationship", weight: 0.05 },
                { name: "relationship_type", weight: 0.05 },
                { name: "family_side", weight: 0.05 },
             ],
            threshold: 0.25,
            ignoreLocation: true,
            minMatchCharLength: 2,
        });
    }, [householdData])

    return (
        <div className="app-container">
            <Header />

            <main className="app-content">
                <Home
                    householdList={householdData}
                    addressList={addressData}
                    updateHHData={updateHouseholdData}
                    refreshDataFromDB={getAllAddressesAndHouseholds}
                    hhIndex={hhIndex}
                />
                {/*<Routes>*/}
                {/*    <Route path="/home">*/}
                {/*        <Home*/}
                {/*            householdList={householdData}*/}
                {/*            addressList={addressData}*/}
                {/*        />*/}
                {/*    </Route>*/}

                {/*    <Route path="/events">*/}
                {/*        <Events />*/}
                {/*    </Route>*/}

                {/*    <Route path="/cards">*/}
                {/*        <Cards />*/}
                {/*    </Route>*/}

                {/*    <Route exact path="/">*/}
                {/*        <Home*/}
                {/*            householdList={householdData}*/}
                {/*            addressList={addressData}*/}
                {/*        />*/}
                {/*    </Route>*/}
                {/*</Routes>*/}
            </main>

            <Footer />
        </div>
    )
}
