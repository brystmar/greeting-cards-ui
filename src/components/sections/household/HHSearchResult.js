export default function HouseholdSearchResult(props) {
    function matchFor(key) {
        return props.matches?.find((m) => m.key === key)
    }

    function highlightMatchedText(text, indices) {
        if (!indices || !indices.length) {
            return text
        }

        let result = []
        let lastIndex = 0

        indices.forEach(([start, end], i) => {
            if (lastIndex < start) {
                result.push(text.slice(lastIndex, start))
            }

            result.push(
                <mark key={i}>{text.slice(start, end + 1)}</mark>
            )

            lastIndex = end + 1
        })

        if (lastIndex < text.length) {
            result.push(text.slice(lastIndex))
        }

        return result
    }

    return (
        <div className="hh-search-result">
            <div className="hh-search-result-title">
                <strong>
                    {highlightMatchedText(
                        props.nickname,
                        matchFor("nickname")?.indices
                    )}
                </strong>
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
