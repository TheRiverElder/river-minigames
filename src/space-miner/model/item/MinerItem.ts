import ChainText from "../../../libs/i18n/ChainText";
import I18nText from "../../../libs/i18n/I18nText";
import PlainText from "../../../libs/i18n/PlainText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import { CreativeType } from "../io/CreativeType";
import Miner from "../miner/Miner";
import Item, { ItemType } from "./Item";

export default class MinerItem extends Item {

    static readonly TYPE = new CreativeType<Item>("miner", (p, data) => new MinerItem(p.game, null as any));

    readonly miner: Miner; 

    override get type(): ItemType {
        return MinerItem.TYPE;
    }
    
    override get name(): string {
        return "miner";
    }

    override get displayedName(): Text {
        const nameParts: Array<Text> = [new I18nText(`item.${this.type.id}.name`)];
        if (this.miner.name) nameParts.push(new PlainText(`: ${this.miner.name}`));
        return new ChainText(nameParts);
    }

    override get description(): Text {
        return new I18nText(`item.miner.description`, {
            "size": this.miner.size.toFixed(2),
            "energy": shortenAsHumanReadable(this.miner.energy),
            "max_energy": shortenAsHumanReadable(this.miner.maxEnergy),
            "harness": this.miner.collector.hardness,
            "total": shortenAsHumanReadable(this.miner.cargo.inventory.total),
            "capacity": shortenAsHumanReadable(this.miner.cargo.inventory.capacity),
        });
    }

    constructor(game: Game, miner: Miner) {
        super(game, 1);
        this.miner = miner;
    }

    override matches(item: Item): boolean {
        return item instanceof MinerItem && item.miner === this.miner;
    }

    override getImage(): string {
        return `./assets/image/miner.svg`;
    }
}