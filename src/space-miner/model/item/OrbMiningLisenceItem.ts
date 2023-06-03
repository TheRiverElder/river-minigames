import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
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

    override get name(): Text {
        return new I18nText("item.orb_mining_liscence", {
            "orb_name": this.orb.name,
            "orb_uid": this.orb.uid,
        }); 
    }

    readonly orb: Orb;

    constructor(orb: Orb) {
        super(1);
        this.orb = orb;
    }

    override onUse(profile: Profile, game: Game): boolean {
        if (this.amount < 1) return false;
        game.spaceExploringCenter.claim(this.orb, profile);
        this.amount -= 1;
        game.displayMessage(`【${profile.name}】宣称了【${this.orb.name}#${this.orb.uid}】的采矿权！`);
        return true;
    }

    override matches(item: Item): boolean {
        return item instanceof OrbMiningLisenceItem && item.orb === this.orb;
    }

    override doCopy(): Item {
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