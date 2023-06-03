import { int } from "../../../libs/CommonTypes";
import { computeIfAbsent } from "../../../libs/lang/Collections";
import { stringHashCode } from "../../../libs/lang/Constants";
import { constrains, rand, randInt, randOne } from "../../../libs/math/Mathmatics";
import PseudoRandom from "../../../libs/math/PseudoRandom";
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
        const uid = world.genOrbUid();
        const name = randOne(ORB_NAMES);
        const fullInfoName = `${name}#${uid}`;
        const hash = stringHashCode(fullInfoName);

        const random = new PseudoRandom(hash);

        const radius = random.nextFloat(40, 60);
        const v = 4 / 3 * Math.PI * radius * radius * radius;

        const mineGeneratingTimes = constrains(Math.floor(v / 5), 3, 6);
        const mines = new Map<ResourceType, int>();
        for (let i = 0; i < mineGeneratingTimes; i++) {
            const oreType = this.oreRandom.random();
            const value = computeIfAbsent(mines, oreType, () => 0) + 1;
            mines.set(oreType, value);
        }
        return new Orb(world, world.genOrbUid(), name, {
            radius,
            color: randInt(0, 0x01000000),
            position: new Vector2(randInt(-500, +500), randInt(-500, +500)),
            forward: rand(0, 2 * Math.PI),
            rotationSpeed: rand(-0.005 * Math.PI, 0.005 * Math.PI),
            revolutionSpeed: rand(-0.0005 * Math.PI, 0.0005 * Math.PI),
        }, Array.from(mines.entries()).map((args) => new ResourceItem(...args)));
    }
}

const ORB_NAMES = [
    "Saturn",
    "Saturnus",
    "Ops",
    "Pikus",
    "Faunus",
    "Fauna",
    "Vesta",
    "Larentia",
    "Volsker",
    "Kakus",
    "Mars",
    "Bellona",
    "Anna",
    "Minewa",
    "Apollo",
    "Venus",
    "Vwetunus",
    "Erebus",
    "Diana",
    "Juturna",
    "Egeria",
    "Oedipus",
    "Neptun",
    "Portunus",
    "Pluto",
    "Manen",
    "Lemuren",
    "Fortuna",
    "Mercury",
    "Janus",
    "Leres",
    "Augur",
    "Evander",
    "Chimare",
    "Fides",
    "Furien",
    "Heracles",
    "Kentaure",
    "Konkordia",
    "Marsfeld",
    "Musen",
    "Nereiden",
    "Nymphen",
    "Orkus",
    "Penaten",
    "Pamona",
    "Sirenen",
    "Vitoria",
];