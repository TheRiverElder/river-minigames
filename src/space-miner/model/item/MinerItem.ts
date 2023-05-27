import Item from "./Item";

export default class MinerItem extends Item {

    onUse(): void {
        this.game.profile;
    }

}