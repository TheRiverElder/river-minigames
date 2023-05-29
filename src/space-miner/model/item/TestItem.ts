import Item from "./Item";
import ItemType from "./ItemType";

export default class TestItem extends Item {

    static readonly TYPE = new ItemType("test", (args) => new TestItem(...args));

    onUse(): void {
        window.confirm("Hello!");
    }
    
    matches(item: Item): boolean {
        return item.type === this.type;
    }
    
    copy(amount: number): Item {
        return new TestItem(this.type, this.game, amount);    
    }

} 