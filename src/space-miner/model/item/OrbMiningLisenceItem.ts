import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import { drawOrbBody } from "../../ui/OrbGraphics";
import Orb from "../orb/Orb";
import Profile from "../Profile";
import Item from "./Item";
import ItemType from "./ItemType";

export default class OrbMiningLicenceItem extends Item {

    static readonly TYPE = new ItemType("orb_mining_licence", () => new OrbMiningLicenceItem(null as any));

    override get type(): ItemType {
        return OrbMiningLicenceItem.TYPE;
    }

    override get displayedName(): Text {
        return new I18nText("item.orb_mining_licence.name", {
            "orb_name": this.orb.name,
            "orb_uid": this.orb.uid,
        }); 
    }

    override get description(): Text {
        return new I18nText("item.orb_mining_licence.description", {
            "orb_name": this.orb.name,
            "orb_uid": this.orb.uid,
        }); 
    }

    readonly orb: Orb;

    constructor(orb: Orb) {
        super(1);
        this.orb = orb;
    }

    override canUse(profile: Profile, game: Game): boolean {
        return true;
    }

    override onUse(profile: Profile, game: Game): boolean {
        if (this.amount < 1) return false;
        game.actions.claimOrb(this.orb, profile);
        this.amount--;
        return true;
    }

    override matches(item: Item): boolean {
        return item instanceof OrbMiningLicenceItem && item.orb === this.orb;
    }

    override doCopy(): Item {
        return new OrbMiningLicenceItem(this.orb);
    }

    override getImage(resources: Map<string, string>): string {
        return resources.get(`orb:${this.orb.uid}`) || "";
    }

}