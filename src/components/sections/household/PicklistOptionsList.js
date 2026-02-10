export default function PicklistOptionsList(props) {
    return (
        <>
            {props.elementList}
        </>
    )
}

PicklistOptionsList.defaultProps = {
    elementList: [ <option className="picklist-option" value={0} /> ]
}
