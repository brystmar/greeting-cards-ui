import React from "react";
import HouseholdContainer from "./HouseholdContainer";
import { defaultHousehold, defaultAddress } from "../../data/defaultData";

export default function Home(props) {
    return (
        <article>
            {/*<div className="title">Home!</div>*/}

            <HouseholdContainer
                householdList={props.householdList}
                addressList={props.addressList}
                updateHHData={props.updateHHData}
                refreshDataFromDB={props.refreshDataFromDB}
            />

        </article>
    )
}

Home.defaultProps = {
    householdList: [ defaultHousehold ],
    addressList:   [ defaultAddress ]
}
