import Game from "../../Game";
import { drawOrbBody } from "../../ui/OrbGraphics";
import Orb from "../Orb";
import Profile from "../Profile";
import Item from "./Item";
import ItemType from "./ItemType";

export default class OrbMiningLisenceItem extends Item {

    static readonly TYPE = new ItemType("orb_mining_lisence", () => new OrbMiningLisenceItem(null as any));

    override get type(): ItemType {
        return OrbMiningLisenceItem.TYPE;
    }

    override get name(): string {
        return `星球开采证:${this.orb.name}#${this.orb.uid}`; 
    }

    readonly orb: Orb;

    constructor(orb: Orb) {
        super(1);
        this.orb = orb;
    }

    override onUse(profile: Profile, game: Game): boolean {
        if (this.amount < 1) return false;
        game.spaceExploringCenter.claim(profile, this.orb);
        this.amount -= 1;
        game.onMessageListener.emit(`【${profile.name}】宣称了【${this.orb.name}#${this.orb.uid}】的采矿权！`);
        return true;
    }

    override copy(): Item {
        return new OrbMiningLisenceItem(this.orb);
    }

    override get image(): string {
        const radius = this.orb.radius;
        const half = radius;
        const canvas = document.createElement("canvas");
        canvas.width = 2 * half;
        canvas.height = 2 * half;
        const g = canvas.getContext("2d"); 
        if (!g) return "";

        drawOrbBody(this.orb, g);

        return canvas.toDataURL();
    }

}