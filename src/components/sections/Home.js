import React from "react";
import HouseholdContainer from "./HouseholdContainer";
import { defaultHousehold, defaultAddress } from "../../data/defaultData";

export default function Home(props) {
    return (
        <article>
            <div className="title">Home!</div>

            <HouseholdContainer
                householdList={props.householdList}
                addressList={props.addressList}
            />

        </article>
    )
}

Home.defaultProps = {
    householdList: [ defaultHousehold ],
    addressList:   [ defaultAddress ]
}
