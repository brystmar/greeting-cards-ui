import React from "react";
import Households from "./Households";

export default function Home(props) {
    return <section>
        <div className="title">Home!</div>

        <Households
            householdList={props.householdList}
            addressList={props.addressList}
        />

    </section>
}

Home.defaultProps = {
    householdList: [{
        id: 0,
        name: "",
        formal_name: "",
        relationship: "",
        primary_address_id: 0
    }],
    addressList: [{
        id: 0,
        household_id: 0,
        is_current: 0,
        is_likely_to_change: 0
    }]
}
