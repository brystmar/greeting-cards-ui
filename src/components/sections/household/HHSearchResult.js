import React from "react";

export default function HouseholdSearchResult({ household }) {
    return (
        <div className="hh-search-result">
            <div className="hh-nickname">
                <strong>{household.nickname}</strong>
            </div>

            <div className="hh-firstnames">
                {household.first_names} {household.surname}
            </div>

            <div className="hh-meta">
                {household.kids && <span>👶 {household.kids}</span>}
                {household.pets && <span>🐾 {household.pets}</span>}
                {household.known_from && <span>📍 {household.known_from}</span>}
            </div>

            <div className="relationship">
                {[household.relationship, household.relationship_type]
                    .filter(Boolean)
                    .join(" • ")}
            </div>
        </div>
    );
}

HouseholdSearchResult.defaultProps = {

}