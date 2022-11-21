export const defaultAddress = {
    id:                  0,
    household_id:        0,
    line_1:              "",
    line_2:              "",
    city:                "",
    state:               "",
    zip:                 "12345",
    country:             "United States",
    full_address:        "",
    is_current:          true,
    is_likely_to_change: false,
    created_date:        new Date("2021-10-18 03:40:35.473881"),
    last_modified:       new Date("2021-10-18 03:40:35.473881"),
    notes:               ""
}

export const defaultHousehold = {
    id:                          0,
    nickname:                    "",
    first_names:                 "",
    surname:                     "",
    address_to:                  "",
    formal_name:                 "",
    relationship:                "",
    relationship_type:           "",
    family_side:                 "",
    kids:                        "",
    pets:                        "",
    should_receive_holiday_card: true,
    created_date:                new Date("2021-10-18 03:40:35.473881"),
    last_modified:               new Date("2021-10-18 03:40:35.473881"),
    notes:                       ""
}

export const defaultEvent = {
    id:          0,
    name:        "",
    date:        new Date("2021-10-18"),
    year:        2021,
    is_archived: false,
    notes:       ""
}

export const defaultCard = {
    id:           0,
    type:         "Thank You",
    status:       "New",
    gift_id:      0,
    household_id: 0,
    address_id:   0,
    date_sent:    new Date("2021-10-18"),
    notes:        ""
}

export const defaultGift = {
    id:                    0,
    event_id:              0,
    household_id:          0,
    description:           "",
    type:                  "",
    origin:                "",
    should_a_card_be_sent: "",
    date:                  new Date("2021-10-18"),
    notes:                 ""
}
