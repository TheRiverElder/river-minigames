import { int, Pair } from "../../../libs/CommonTypes";
import { createArray } from "../../../libs/lang/Collections";
import Optional from "../../../libs/lang/Optional";
import { constrains, rand, randInt } from "../../../libs/math/Mathmatics";
import Vector2 from "../../../libs/math/Vector2";
import WeightedRandom from "../../../libs/math/WeightedRandom";
import ResourceItem from "../item/ResourceItem";
import Orb from "../Orb";
import ResourceType from "../ResourceType";
import World from "../World";

export default class OrbGenerator {

    readonly oreRandom: WeightedRandom<ResourceType>;

    constructor(oreRandom: WeightedRandom<ResourceType>) {
        this.oreRandom = oreRandom;
    }

    generate(world: World): Orb {
        const radius = rand(40, 60);
        const v = 4 / 3 * Math.PI * radius * radius * radius;
        const mineGeneratingTimes = constrains(Math.floor(v / 5), 3, 6);
        const mines = createArray(mineGeneratingTimes, () => this.oreRandom.random())
            .reduce((prev: Array<Pair<ResourceType, int>>, c) => {
                Optional.ofNullable<Pair<ResourceType, int>>(prev.find(([v]) => v === c) || null)
                    .ifPresent(
                        (pair: Pair<ResourceType, int>) => (pair[1]++),
                        () => prev.push([c, 1]),
                    );
                return prev;
            }, [] as Array<Pair<ResourceType, int>>)
            .map(pair => new ResourceItem(pair[0], pair[1]));
        return new Orb(world, world.genOrbUid(), "Mars", {
            radius,
            color: randInt(0, 0x01000000),
            position: new Vector2(randInt(-500, +500), randInt(-500, +500)),
            forward: rand(0, 2 * Math.PI),
            rotationSpeed: rand(-0.005 * Math.PI, 0.005 * Math.PI),
            revolutionSpeed: rand(-0.0005 * Math.PI, 0.0005 * Math.PI),
        }, mines); 
    }
}