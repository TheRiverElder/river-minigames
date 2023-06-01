import { double } from "../../../libs/CommonTypes";
import Game from "../../Game";
import Profile from "../Profile";
import Item from "./Item";
import ItemType from "./ItemType";

export default class TestItem extends Item {

    static readonly TYPE = new ItemType("test", () => new TestItem());

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

    override doCopy(amount?: double): Item {
        return new TestItem(amount);
    }

} 