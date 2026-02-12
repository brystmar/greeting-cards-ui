import HouseholdSearchResult from "./HHSearchResult"

export default function HouseholdSearchBox({
                                               query,
                                               searchResults,
                                               activeIndex,
                                               onQueryChange,
                                               onKeyboardInput,
                                               onSelect
                                           }) {
    return (
        <div className="hh-search-box-container">
            <input
                type="text"
                className="hh-search-box"
                placeholder="Search by name(s), including kids & pets"
                value={query}
                tabIndex={0}
                onChange={onQueryChange}
                onKeyDown={onKeyboardInput}
                autoFocus
            />

            {searchResults.length > 0 && (
                <ul className="hh-search-results">
                    {searchResults.map(({ item, matches }, index) => (
                        <li
                            key={item.id}
                            className={`hh-search-result-container ${index === activeIndex ? "active" : ""}`}
                            onClick={() => onSelect(item.id)}
                        >
                            <HouseholdSearchResult {...item} matches={matches} />
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
