import React, { useState, useEffect } from "react";

export default function HHInfo(props) {
    const [ hhData, updateHHData ] = useState({
        id:                       props.id,
        nickname:                 props.nickname,
        firstNames:               props.firstNames,
        surname:                  props.surname,
        formalName:               props.formalName,
        relationship:             props.relationship,
        relationshipType:         props.relationshipType,
        familySide:               props.familySide,
        kids:                     props.kids,
        shouldReceiveHolidayCard: props.shouldReceiveHolidayCard,
        notes:                    props.notes 
    })

    return (
        <div className="household-info">
            {JSON.stringify(props)}
        </div>
    )
}

HHInfo.defaultProps = {
    id:                       0,
    nickname:                 "",
    firstNames:               "",
    surname:                  "",
    formalName:               "",
    relationship:             "",
    relationshipType:         "",
    familySide:               "",
    kids:                     "",
    shouldReceiveHolidayCard: 1,
    notes:                    ""
}
