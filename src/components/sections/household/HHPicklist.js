// import { useEffect } from "react";
// import PicklistOption from "./PicklistOption";
// import { defaultAddress, defaultHousehold } from "../../../data/defaultData";
//
// export default function HHPicklist(props) {
//     // Build the array of picklist options
//     let picklistOptions = mapHouseholdData(props.householdList)
//
//     // Map each household record into a picklist option
//     function mapHouseholdData(hhList) {
//         console.debug(`Starting mapHouseholdData with ${hhList.length} HHs`)
//
//         if (!Array.isArray(hhList)) {
//             console.error("Invalid household list:", hhList);
//             return []
//         }
//
//         const output = hhList.sort((a, b) => {
//             if (a.nickname.toLowerCase() > b.nickname.toLowerCase()) {
//                 return 1
//             }
//             if (a.nickname.toLowerCase() < b.nickname.toLowerCase()) {
//                 return -1
//             }
//             return 0
//         });
//
//         return output.map((selectedHousehold, index) =>
//             <PicklistOption
//                 key={index}
//                 id={selectedHousehold.id}
//                 nickname={selectedHousehold.nickname}
//             />
//         )
//     }
//
//     function handleHouseholdChange(event) {
//         console.debug("Start of handleHouseholdChange(event)")
//         // console.debug(`hhId: ${event.target.value}`)
//         // Update the id, nickname, and address count for the selected household
//         props.updateSelection({
//             ...props.selection,
//             householdId:  event.target.value,
//             addressCount: props.addressList.filter((address) => address.household_id.toString() === event.target.value).length,
//             addrList:     props.addressList.filter((address) => address.household_id.toString() === event.target.value)
//         })
//
//         // Update the household data for the selected object
//         props.updateSelectedHH(props.householdList.filter((hh) => hh.id.toString() === event.target.value.toString())[0])
//     }
//
//     // When householdList changes, update state and the list of picklist options
//     useEffect(() => {
//         console.debug("List of households was updated by HouseholdContainer.useEffect")
//
//         // picklistOptions = mapHouseholdData(props.householdList)
//
//         // Initialize the selected id to the selected household
//         console.log(`props.hhList[0]: ${JSON.stringify(props.householdList[0])}`)
//         console.log(`props.addressList[0]: ${JSON.stringify(props.addressList[0])}`)
//         try {
//             props.updateSelection({
//                 householdId: props.selection.householdId,
//                 addressCount: props.addressList.filter((address) => address.household_id.toString() === props.selection.householdId.toString()).length,
//                 addrList:     props.addressList.filter((address) => address.household_id.toString() === props.selection.householdId.toString())
//             })
//
//             // Fill HHInfo for the selected household
//             props.updateSelectedHH(props.householdList.filter((hh) => hh.id.toString() === props.selection.householdId.toString())[0])
//             // updateSelectedHH(selection.householdId)
//         } catch(e) {
//             console.log(`Error in HHPicklist UseEffect: ${e}`)
//             // updateSelectedHH([defaultHousehold])
//         }
//     }, [ props.householdList, props.addressList, props.selection.householdId ])
//
//     return (
//         <select
//             name="householdId"
//             id="households-selection-box"
//             className="selection-box"
//             size={Math.min(props.householdList.length, 18)}
//             value={props.selection.householdId}
//             onChange={handleHouseholdChange}
//             required={false}
//         >
//             {picklistOptions}
//         </select>
//     )
// }
//
// HHPicklist.defaultProps = {
//     selection:              {
//         householdId:    0,
//         addressCount:   0,
//         addrList:       [ { id: 0, line_1: "" } ]
//     },
//     selectedHH:             defaultHousehold,
//     householdList:          [ defaultHousehold ],
//     addressList:            [ defaultAddress ],
//     insertNewRecordMode:    false
// }
