import Game from "../../Game";
import { CreativeType } from "../io/CreativeType";
import Profile from "../Profile";
import Item, { ItemType } from "./Item";

export default class TestItem extends Item {

    static readonly TYPE = new CreativeType<Item>("test", (p, data) => new TestItem(p.game));

    override get type(): ItemType {
        return TestItem.TYPE;
    }

    override onUse(profile: Profile, game: Game): boolean {
        game.displayMessage(`Hello World!`);
        return true;
    }
    
    override matches(item: Item): boolean {
        return item.type === this.type;
    }

} 