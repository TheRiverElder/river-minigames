import Game from "../../Game";
import Orb from "../Orb";
import Profile from "../Profile";
import Item from "./Item";
import ItemType from "./ItemType";

export default class OrbMiningLisenceItem extends Item {

    static readonly TYPE = new ItemType("miner", () => new OrbMiningLisenceItem());

    override get type(): ItemType {
        return OrbMiningLisenceItem.TYPE;
    }

    orb!: Orb;

    constructor(orb?: Orb) {
        super(1);
        if (orb) this.orb = orb;
    }

    override onUse(profile: Profile, game: Game): void {
        game.spaceExploringCenter.claim(profile, this.orb);
    }

}