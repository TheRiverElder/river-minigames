import { double } from "../../../libs/CommonTypes";
import Item from "./Item";
import ItemType from "./ItemType";

export default class TestItem extends Item {

    static readonly TYPE = new ItemType("test", () => new TestItem());

    override get type(): ItemType {
        return TestItem.TYPE;
    }

    override onUse(): void {
        window.confirm("Hello!");
    }
    
    override matches(item: Item): boolean {
        return item.type === this.type;
    }

    override copy(amount?: double): Item {
        return new TestItem(amount);
    }

} 