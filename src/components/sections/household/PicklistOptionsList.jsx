import PicklistOption from "./PicklistOption"

export default function PicklistOptionsList({ elementList = [] }) {
    const sorted = elementList
        .slice()
        .sort((a, b) =>
            (a.nickname || "").toLowerCase().localeCompare((b.nickname || "").toLowerCase())
        )

    return sorted.map((hh) => (
        <PicklistOption
            key={hh.id}
            id={hh.id}
            nickname={hh.nickname}
            first_names={hh.first_names}
            surname={hh.surname}
        />
    ))
}
