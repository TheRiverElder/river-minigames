import Orb from "../Orb";
import Item from "./Item";
import ItemType from "./ItemType";

export default class OrbMiningLisenceItem extends Item {

    static readonly TYPE = new ItemType("miner",([...args]) => new OrbMiningLisenceItem(...args));

    orb!: Orb;

    override onUse(): void {
        this.game.spaceExploringCenter.claim(this.game.profile, this.orb);
    }
    
    override matches(item: Item): boolean {
        return item.type === this.type && (item as OrbMiningLisenceItem).orb === this.orb;
    }
    
    override copy(amount: number): Item {
        const item = new OrbMiningLisenceItem(this.type, this.game, 1);
        item.orb = this.orb;
        return item;
    }

}