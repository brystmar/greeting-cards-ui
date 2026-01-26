import React from "react";

export default function PicklistOption(props) {
    return (
        <option
            className="picklist-option"
            value={props.id}
        >
            {props.nickname}
        </option>
    )
}

PicklistOption.defaultProps = {
    id:       0,
    nickname: ""
}
