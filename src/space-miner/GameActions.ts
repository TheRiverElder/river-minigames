import I18nText from "../libs/i18n/I18nText";
import Game from "./Game";
import Inventory from "./model/Inventory";
import Item from "./model/item/Item";
import Miner from "./model/miner/Miner";
import Orb from "./model/Orb";
import Profile from "./model/Profile";

export default class GameActions {
    readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }


    refillMinerEnergy(miner: Miner) {
        const energyPrice = 10;
        const refilledEnergy = Math.min(miner.frame.maxEnergy - miner.frame.energy, this.game.profile.account / energyPrice);
        this.game.profile.account -= refilledEnergy * energyPrice;
        miner.frame.mutateEnergy(refilledEnergy);
    }
    
    useItem(item: Item, inventory: Inventory, profile: Profile) {
        const previousAmount = item.amount;
        const succeeded = item.onUse(profile, this.game);
        inventory.cleanUp();
        if (succeeded) this.game.displayMessage(new I18nText("game.game.message.used_item", {
            "user": profile.name,
            "item": item.name,
            "amount": previousAmount - item.amount,
        }));
    }
    
    claimOrb(orb: Orb, profile: Profile) {
        if (this.game.spaceExploringCenter.claim(orb, profile)) {
            this.game.displayMessage(new I18nText("game.actions.message.claimed_orb", {
                "user": profile.name,
                "orb_name": orb.name,
                "orb_uid": orb.uid,
            }))
        }
    }

}