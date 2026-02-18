export default function PicklistOption({
                                           id = 0,
                                           nickname = "",
                                           first_names = "",
                                           surname = ""
                                       }) {
    return (
        <option value={id}>
            {nickname}
        </option>
    )
}
