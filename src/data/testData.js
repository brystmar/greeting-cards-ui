export const addresses = [
    {
        id:                  101,
        family_id:           1,
        line_1:              "123 Alpha Ave",
        city:                "Springfield",
        state:               "IL",
        postal_code:         "60601",
        country:             "United States",
        is_current:          1,
        is_likely_to_change: 0
    },
    {
        id:                  102,
        family_id:           2,
        line_1:              "234 Bravo Blvd",
        city:                "Austin",
        state:               "TX",
        postal_code:         "78701",
        country:             "United States",
        is_current:          0,
        is_likely_to_change: 1
    },
    {
        id:                  103,
        family_id:           3,
        line_1:              "345 Columbus Cir",
        line_2:              "Apt 27B",
        city:                "New York",
        state:               "NY",
        postal_code:         "12345",
        country:             "United States",
        is_current:          1,
        is_likely_to_change: 1
    }
];

export const households = [
    {
        id:                 1,
        name:               "The Simpsons",
        formal_name:        "Mr. and Mrs. Simpson",
        relationship:       "Immediate Family",
        primary_address_id: 101
    },
    {
        id:                 2,
        name:               "Curie Fam",
        formal_name:        "Dr. and Mr. Curie",
        relationship:       "Extended Family",
        primary_address_id: 102
    },
    {
        id:                 3,
        name:               "Andersons",
        formal_name:        "Mr. Neo and Ms. Trinity Anderson",
        relationship:       "Friends",
        primary_address_id: 103
    }
];

export const events = [
    {
        id:          1,
        name:        "Our wedding",
        date:        "2020-01-15",
        year:        2020,
        is_archived: 1
    },
    {
        id:          2,
        name:        "Graduation",
        date:        "2015-03-28",
        year:        2015,
        is_archived: 1
    },
    {
        id:          3,
        name:        "Holiday card",
        date:        "2021-12-20",
        year:        2021,
        is_archived: 0
    }
];

export const gifts = [
    {
        id:          1,
        event_id:    1,
        family_id:   1,
        description: "Pencil shavings and a firm handshake"
    },
    {
        id:          2,
        event_id:    1,
        family_id:   2,
        description: "Blender #4",
        notes:       "Another blender?"
    },
    {
        id:          3,
        event_id:    1,
        family_id:   3,
        description: "Post-dated couples therapy coupons",
        notes:       "Passive aggressive much?"
    },
    {
        id:          4,
        event_id:    2,
        family_id:   1,
        description: "Well wishes and a crisp $5 bill",
        notes:       "$5 is nothing with inflation, grandma"
    },
    {
        id:          5,
        event_id:    2,
        family_id:   3,
        description: "Inspector Spacetime satchel",
        notes:       "Cool.  Cool cool cool."
    },
];

export const cards = [
    {
        id:            1,
        was_card_sent: 1,
        event_id:      1,
        gift_id:       1,
        family_id:     1,
        address_id:    101
    },
    {
        id:            2,
        was_card_sent: 0,
        event_id:      1,
        gift_id:       2,
        family_id:     2,
        address_id:    102
    },
    {
        id:            3,
        was_card_sent: 0,
        event_id:      2,
        gift_id:       5,
        family_id:     3,
        address_id:    103
    }
];
