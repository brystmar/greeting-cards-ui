import React from "react";
import Households from "./Households";
import { defaultHousehold, defaultAddress } from "../../data/defaultData";

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
    householdList: [ defaultHousehold ],
    addressList:   [ defaultAddress ]
}
