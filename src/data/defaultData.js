export const address = {
    id:                  0,
    household_id:        0,
    line_1:              "",
    city:                "",
    state:               "",
    zip:                 "12345",
    country:             "United States",
    is_current:          1,
    is_likely_to_change: 0,
    created_date:        new Date("2021-10-18 03:40:35.473881"),
    last_modified:       new Date("2021-10-18 03:40:35.473881")
}

export const household = {
    id:                0,
    nickname:          "",
    first_names:       "",
    surname:           "",
    formal_name:       "",
    relationship:      "",
    relationship_type: "",
    family_side:       "",
    notes:             ""
}

export const event = {
    id:          0,
    name:        "",
    date:        "",
    year:        2021,
    is_archived: 0
}

export const card = {
    id:            0,
    was_card_sent: 1,
    event_id:      0,
    household_id:  0,
    address_id:    0
}

export const gift = {
    id:           0,
    event_id:     0,
    household_id: 0,
    description:  "",
    notes:        ""
}
