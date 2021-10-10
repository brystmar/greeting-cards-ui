import React from "react";

export default function PicklistOption(props) {
    return (
        <option
            className="picklist-option"
            value={props.value}
        >
            {props.name}
        </option>
    )
}

PicklistOption.defaultProps = {
    value:        0,
    name:         ""
}
