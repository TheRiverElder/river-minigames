import Game from "../../Game";
import Orb from "../Orb";
import Profile from "../Profile";
import Item from "./Item";
import ItemType from "./ItemType";

export default class OrbMiningLisenceItem extends Item {

    static readonly TYPE = new ItemType("orb_mining_lisence", () => new OrbMiningLisenceItem(null as any));

    override get type(): ItemType {
        return OrbMiningLisenceItem.TYPE;
    }

    readonly orb: Orb;

    constructor(orb: Orb) {
        super(1);
        this.orb = orb;
    }

    override onUse(profile: Profile, game: Game): void {
        game.spaceExploringCenter.claim(profile, this.orb);
    }

    override copy(): Item {
        return new OrbMiningLisenceItem(this.orb);
    }

}