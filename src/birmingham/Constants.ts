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

export const CitySlotTypes = {
    INDUSTRY: "industry",
    MERCHANT: "merchant",
};

export const CITY_SLOTS = [
    { type: "industry", location: ["berby", 0], position: [2867, 942] },
    { type: "industry", location: ["berby", 1], position: [3054, 942] },
    { type: "industry", location: ["berby", 2], position: [2960, 754] },
    { type: "industry", location: ["birmingham", 0], position: [2338, 2717] },
    { type: "industry", location: ["birmingham", 1], position: [2524, 2717] },
    { type: "industry", location: ["birmingham", 2], position: [2338, 2529] },
    { type: "industry", location: ["birmingham", 3], position: [2524, 2529] },
    { type: "industry", location: ["stone", 0], position: [1053, 918] },
    { type: "industry", location: ["stone", 1], position: [1238, 918] },
    { type: "industry", location: ["walsall", 0], position: [1947, 2163] },
    { type: "industry", location: ["walsall", 1], position: [2132, 2163] },
    { type: "industry", location: ["burton_upon_trent", 0], position: [2556, 1410] },
    { type: "industry", location: ["burton_upon_trent", 1], position: [2742, 1410] },
    { type: "industry", location: ["wolverhampton", 0], position: [1302, 2071] },
    { type: "industry", location: ["wolverhampton", 1], position: [1486, 2071] },
    { type: "industry", location: ["stafford", 0], position: [1425, 1293] },
    { type: "industry", location: ["stafford", 1], position: [1613, 1293] },
    { type: "industry", location: ["cannock", 0], position: [1722, 1703] },
    { type: "industry", location: ["cannock", 1], position: [1906, 1703] },
    { type: "industry", location: ["tamworth", 0], position: [2616, 1911] },
    { type: "industry", location: ["tamworth", 1], position: [2797, 1911] },
    { type: "industry", location: ["stoke_on_trent", 0], position: [1470, 495] },
    { type: "industry", location: ["stoke_on_trent", 1], position: [1658, 495] },
    { type: "industry", location: ["stoke_on_trent", 2], position: [1564, 309] },
    { type: "industry", location: ["coventry", 0], position: [3067, 2843] },
    { type: "industry", location: ["coventry", 1], position: [3254, 2843] },
    { type: "industry", location: ["coventry", 2], position: [3160, 2655] },
    { type: "industry", location: ["dudley", 0], position: [1487, 2562] },
    { type: "industry", location: ["dudley", 1], position: [1672, 2562] },
    { type: "industry", location: ["uttoxeter", 0], position: [2083, 849] },
    { type: "industry", location: ["uttoxeter", 1], position: [2272, 849] },
    { type: "industry", location: ["coalbrookdale", 0], position: [750, 2247] },
    { type: "industry", location: ["coalbrookdale", 1], position: [936, 2247] },
    { type: "industry", location: ["coalbrookdale", 2], position: [843, 2059] },
    { type: "industry", location: ["kidderminster", 0], position: [1208, 2975] },
    { type: "industry", location: ["kidderminster", 1], position: [1394, 2975] },
    { type: "industry", location: ["worcester", 0], position: [1260, 3494] },
    { type: "industry", location: ["worcester", 1], position: [1448, 3494] },
    { type: "industry", location: ["leek", 0], position: [2034, 205] },
    { type: "industry", location: ["leek", 1], position: [2221, 205] },
    { type: "industry", location: ["belper", 0], position: [2739, 264] },
    { type: "industry", location: ["belper", 1], position: [2926, 264] },
    { type: "industry", location: ["belper", 2], position: [3112, 264] },
    { type: "industry", location: ["redditch", 0], position: [2150, 3189] },
    { type: "industry", location: ["redditch", 1], position: [2339, 3189] },
    { type: "industry", location: ["nuneaton", 0], position: [2976, 2315] },
    { type: "industry", location: ["nuneaton", 1], position: [3164, 2315] },
    { type: "industry", location: ["anonymous_1", 0], position: [1108, 1653] },
    { type: "industry", location: ["anonymous_2", 0], position: [952, 3275] },

    { type: "merchant", location: ["warrington", 0], position: [933, 426] },
    { type: "merchant", location: ["warrington", 1], position: [1122, 426] },
    { type: "merchant", location: ["nottingham", 0], position: [3437, 680] },
    { type: "merchant", location: ["nottingham", 1], position: [3625, 680] },
    { type: "merchant", location: ["oxford", 0], position: [3127, 3328] },
    { type: "merchant", location: ["oxford", 1], position: [3314, 3328] },
    { type: "merchant", location: ["gloucester", 0], position: [2238, 3632] },
    { type: "merchant", location: ["gloucester", 1], position: [2422, 3632] },
    { type: "merchant", location: ["shrewsbury", 0], position: [269, 2268] },
];