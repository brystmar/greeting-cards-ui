import HouseholdContainer from "./HouseholdContainer";
import { defaultHousehold, defaultAddress } from "../../data/defaultData";

export default function Households(props) {
    return (
        <article>
            {/*<div className="title">Home!</div>*/}

            <HouseholdContainer
                householdList={props.householdList}
                addressList={props.addressList}
                updateHHData={props.updateHHData}
                updateAddressData={props.updateAddressData}
                refreshDataFromDB={props.refreshDataFromDB}
                hhIndex={props.hhIndex}
                nextIds={props.nextIds}
            />
        </article>
    )
}

Households.defaultProps = {
    householdList:  [ defaultHousehold ],
    addressList:    [ defaultAddress ],
    nextIds:        { nextAddressId: 0, nextHouseholdId: 0 }
}
