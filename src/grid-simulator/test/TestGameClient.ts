import { rgbFromInt } from "../../libs/math/Colors";
import GameClient from "../core/game/GameClient";
import { Values } from "../core/value/Values";
import { createAtanNormalizer, createLinearNormalizer } from "../ui/NormlizeFunctions";

export function createTestGameClient() {
    const client = new GameClient();

    client.registryValueDisplayConfig.addAll([
        {
            type: Values.HEAT,
            normalizeFunction: createAtanNormalizer(100e3),
            defaultUnit: "J",
            presentColor: rgbFromInt(0xff0000),
        },
        {
            type: Values.MASS,
            normalizeFunction: createAtanNormalizer(1000),
            defaultUnit: "kg",
            presentColor: rgbFromInt(0x00ff00),
        },
        {
            type: Values.TEMPERATURE,
            normalizeFunction: createAtanNormalizer(300),
            defaultUnit: "K",
            presentColor: rgbFromInt(0xff0000),
        },
        {
            type: Values.THERMAL_CONDUCTIVITY,
            normalizeFunction: createLinearNormalizer(1),
            defaultUnit: "W/K",
            presentColor: rgbFromInt(0x00ff00),
            readableNumberOptions: { minimum: 0.001 },
        },
    ]);

    return client;
}