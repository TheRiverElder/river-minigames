import ChainText from "../../../libs/i18n/ChainText";
import I18nText from "../../../libs/i18n/I18nText";
import PlainText from "../../../libs/i18n/PlainText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Miner from "../miner/Miner";
import Item from "./Item";
import ItemType from "./ItemType";

export default class MinerItem extends Item {

    static readonly TYPE = new ItemType("miner", () => new MinerItem(null as any));

    readonly miner: Miner; 

    override get type(): ItemType {
        return MinerItem.TYPE;
    }
    
    override get name(): string {
        return "miner";
    }

    override get displayedName(): Text {
        const nameParts: Array<Text> = [new I18nText(`item.${this.type.name}.name`)];
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

    constructor(miner: Miner) {
        super(1);
        this.miner = miner;
    }

    override matches(item: Item): boolean {
        return item instanceof MinerItem && item.miner === this.miner;
    }
    
    override doCopy(): Item {
        return new MinerItem(this.miner.copy());
    }

    override getImage(): string {
        return `./assets/image/miner.svg`;
    }
}