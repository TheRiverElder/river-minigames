import ChainText from "../../../libs/i18n/ChainText";
import I18nText from "../../../libs/i18n/I18nText";
import PlainText from "../../../libs/i18n/PlainText";
import Text from "../../../libs/i18n/Text";
import Miner from "../miner/Miner";
import Item from "./Item";
import ItemType from "./ItemType";

export default class MinerItem extends Item {

    static readonly TYPE = new ItemType("miner", () => new MinerItem(null as any));

    readonly miner: Miner; 

    override get type(): ItemType {
        return MinerItem.TYPE;
    }

    override get name(): Text {
        const nameParts: Array<Text> = [new I18nText(`item.${this.type.name}.name`)];
        if (this.miner.name) nameParts.push(new PlainText(`: ${this.miner.name}`));
        return new ChainText(nameParts);
    }

    override get description(): Text {
        return new I18nText(`item.miner.description`, {
            "size": this.miner.size.toFixed(2),
            "energy": this.miner.energy.toFixed(2),
            "max_energy": this.miner.maxEnergy.toFixed(2),
            "mineable_resource_type": new I18nText(`resource_type.${this.miner.collector.mineableResourceType.name}`),
            "total": this.miner.cargo.inventory.total,
            "capacity": this.miner.cargo.inventory.getCapacity(),
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
        return new MinerItem(this.miner);
    }

    public get image(): string {
        return `./assets/image/miner.svg`;
    }
}