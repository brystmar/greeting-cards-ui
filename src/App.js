import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/sections/Home";
import Addresses from "./components/sections/Addresses";
import Cards from "./components/sections/Cards";
import Events from "./components/sections/Events";
import Households from "./components/sections/Households";
import './styles/styles.css';
import './styles/sections.css';
import { Route, Switch } from "react-router-dom";
import { households, addresses } from "./data/testData";


export default function App() {
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
