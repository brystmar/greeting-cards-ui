import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/sections/Home";
import Addresses from "./components/sections/Addresses";
import Cards from "./components/sections/Cards";
import Events from "./components/sections/Events";
import Households from "./components/sections/Households";
import './styles/styles.css';
import './styles/sections.css';
import React, { useState, useEffect } from "react";
import { Route, Switch } from "react-router-dom";
import { api } from "./data/endpoints";
import { address, household, card, event, gift } from "./data/defaultData";
import { households, addresses } from "./data/testData";


export default function App() {
    const [ addressData, updateAddressData ] = useState([ address ])
    const [ householdData, updateHouseholdData ] = useState([ household ])

    // Retrieve and store data from the database in memory
    useEffect(() => {
            // Declare an async function for retrieving data
            async function getData() {
                try {
                    console.debug(`Calling endpoint: ${api.addresses.all}`)

                    // Make the GET requests
                    const addressListRequest = await fetch(api.addresses.all)
                    const householdListRequest = await fetch(api.households.all)

                    // Parse the response, which should be a list of object literals
                    const addressListResponse = await addressListRequest.json()
                    const householdListResponse = await householdListRequest.json()

                    // Update local state
                    updateAddressData(addressListResponse.data)
                    updateHouseholdData(householdListResponse.data)
                } catch (error) {
                    console.error(`Error retrieving (or parsing) address list: ${error}`)
                }
            }

            // Call the async function declared above
            console.info("Retrieving list of addresses & hosueholds via App.useEffect")
            getData()
                .then(() => console.log("Request within App.useEffect.getData() was successful!"))
                .catch(() => console.error("Error somewhere within the App.useEffect.getData() call"))
                .finally(() => {
                    console.debug("End of App.useEffect.getData()")
                    console.log(`addressData: \n${JSON.stringify(addressData)}`)
                    console.log(`hhData: \n${JSON.stringify(householdData)}`)
                })
        },
        [ addressData, householdData ])

    return (
        <div className="app-container">
            <Header />

            <main className="app-content">
                <Switch>
                    <Route path="/home">
                        <Home
                            householdList={households}
                            addressList={addresses}
                        />
                    </Route>

                    <Route path="/households">
                        <Households
                            householdList={households}
                            addressList={addresses}
                        />
                    </Route>

                    <Route path="/addresses">
                        <Addresses
                            householdList={households}
                            addressList={addresses}
                        />
                    </Route>

                    <Route path="/events">
                        <Events />
                    </Route>

                    <Route path="/cards">
                        <Cards />
                    </Route>

                    <Route exact path="/">
                        <Home
                            householdList={households}
                            addressList={addresses}
                        />
                    </Route>
                </Switch>
            </main>

            <Footer />
        </div>
    )
}
