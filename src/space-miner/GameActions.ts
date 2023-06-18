import I18nText from "../libs/i18n/I18nText";
import Game from "./Game";
import Inventory from "./model/Inventory";
import Item from "./model/item/Item";
import MinerItem from "./model/item/MinerItem";
import Miner from "./model/miner/Miner";
import Orb from "./model/orb/Orb";
import Profile from "./model/Profile";
import Technology from "./model/technology/Technology";

export default class GameActions {
    readonly game: Game;

    constructor(game: Game) {
        this.game = game;
    }

    unlockTechnology(technology: Technology, profile: Profile) {
        if (profile.unlockedTechnologies.has(technology)) return;
        profile.unlockedTechnologies.add(technology);
        technology.onUnlock(profile, this.game);
        this.game.displayMessage(new I18nText(`game.game.message.unlocked_technology`, {
            "technology": new I18nText(`technology.${technology.name}`),
            "level": technology.level,
            "user": profile.name,
        }));
    }


    retriveMinerResource(miner: Miner, profile: Profile) {
        const itemTotal = miner.inventory.total;
        miner.inventory.clear().forEach(item => profile.warehouse.add(item));
        this.game.displayMessage(new I18nText(`game.game.message.retrived_miner_resource`, {
            "total": itemTotal.toFixed(2),
        }));
        miner.setup();
    }

    refillMinerEnergy(miner: Miner) {
        const energyPrice = 10;
        const refilledEnergy = Math.min(miner.frame.maxEnergy - miner.frame.energy, this.game.profile.account / energyPrice);
        this.game.profile.account -= refilledEnergy * energyPrice;
        miner.frame.mutateEnergy(refilledEnergy);
        this.game.displayMessage(new I18nText(`game.game.message.refilled_miner_energy`, {
            "energy": refilledEnergy.toFixed(2),
        }));
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

    deploy(orb: Orb, miners: Array<MinerItem>, profile: Profile): boolean {
        if (orb.owner !== profile) return false;
        miners.forEach(minerItem => {
            orb.addMiner(minerItem.miner);
            minerItem.amount--;
        });
        profile.warehouse.cleanUp();
        this.game.displayMessage(new I18nText("game.actions.message.deployed_miners_to_orb", {
            "user": profile.name,
            "orb_name": orb.name,
            "orb_uid": orb.uid,
            "miner_amount": miners.length,
        }));
        return true;
    }

}