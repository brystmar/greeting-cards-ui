import React from "react";

export default function HouseholdSearchResult(props) {
    return (
        <div className="hh-search-result">
            <div className="hh-search-result-title">
                {props.nickname}
            </div>

            <div className="hh-search-result-subtitle">
                <label>{props.first_names}</label>
                <label className="separator">||</label>
                <label>{props.surname}</label>
            </div>

            <div className="hh-search-result-info">
                {props.kids.length > 0 && (
                    <span className="hh-search-result-other-info">
                        <label>Kids:</label>
                        {props.kids}
                    </span>
                )}

                {props.pets.length > 0 && (
                    <span className="hh-search-result-other-info">
                        <label>Pets:</label>
                        {props.pets}
                    </span>
                )}

                <span className="hh-search-result-other-info">
                    <label>Known From:</label>
                    {props.known_from}
                </span>

                <span className="hh-search-result-relationship">
                    {[props.relationship_type, props.relationship]
                        .filter(Boolean)
                        .join(" >> ")}
                </span>
            </div>
        </div>
    )
}

HouseholdSearchResult.defaultProps = {
    nickname:               "",
    first_names:            "",
    surname:                "",
    kids:                   "",
    pets:                   "",
    known_from:             "",
    relationship:           "",
    relationship_type:      ""
}
