export const Industries = {
    COAL_MINE: "coal_mine",
    IRON_WORKS: "iron_works",
    BREWERY: "brewery",
    COTTON_MILL: "cotton_mill",
    MANUFACTURER: "manufacturer",
    POTTERY: "pottery",
};

export const Cities = {
    BIRMINGHAM: "birmingham",
    CONVENTRY: "conventry",
    KIDDMINSTER: "kiddminster",
};

export const CITIES = [
    {
        name: "birmingham",
        industrySlots: [
            [Industries.COTTON_MILL, Industries.MANUFACTURER],
            [Industries.IRON_WORKS],
            [Industries.MANUFACTURER],
            [Industries.MANUFACTURER],
        ],
    },
    {
        name: "conventry",
        industrySlots: [
            [Industries.POTTERY],
            [Industries.IRON_WORKS],
            [Industries.COAL_MINE],
        ],
    },
];

export const LINKS = [
    {
        uid: 1,
        head: "birmingham",
        tail: "conventry",
    },
    {
        uid: 3,
        head: "birmingham",
        tail: "kiddminster",
    },
];