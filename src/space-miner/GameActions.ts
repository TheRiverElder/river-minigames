import I18nText from "../libs/i18n/I18nText";
import Game from "./Game";
import FacilityItem from "./model/item/FacilityItem";
import Item from "./model/item/Item";
import Miner from "./model/miner/Miner";
import Inventory from "./model/misc/storage/Inventory";
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

    maintainMiner(miner: Miner, profile: Profile): boolean {
        const location = miner.location;
        if (!location) {
            this.game.displayMessage(new I18nText(`game.game.message.miner_not_deployed`));
            return false;
        }
        if (location.depth > 0) {
            this.game.displayMessage(new I18nText(`game.game.message.miner_not_on_surface`));
            return false;
        }
        this.retriveMinerResource(miner, profile);
        this.refillMinerEnergy(miner);
        miner.setup();
        return true;
    }

    // recallMiner(facility: Facility, profile: Profile) {
    //     if (!this.maintainMiner(facility, profile)) return;
    //     if (!facility.location?.orb.removeFacility(facility)) return;
    //     profile.warehouse.add(new MinerItem(facility));
    //     this.game.displayMessage(new I18nText(`game.game.message.recall_miner`, {
    //         "miner": facility.name,
    //     }));
    // }

    restartMiner(miner: Miner, profile: Profile) {
        if (!this.maintainMiner(miner, profile)) return;
        this.game.displayMessage(new I18nText(`game.game.message.restart_miner`, {
            "miner": miner.name,
        }));
    }


    retriveMinerResource(miner: Miner, profile: Profile) {
        const itemTotal = miner.inventory.total;
        miner.inventory.clear().forEach(item => profile.warehouse.add(item));
        this.game.displayMessage(new I18nText(`game.game.message.retrived_miner_resource`, {
            "total": itemTotal.toFixed(2),
        }));
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
            "item": item.displayedName,
            "amount": previousAmount - item.amount,
        }));
    }
    
    harvestItem(item: Item, inventory: Inventory, profile: Profile) {
        const tokenItem = inventory.removeExact(item);
        if (tokenItem.amount <= 0) return;
        profile.warehouse.add(tokenItem);
        inventory.cleanUp();
        profile.warehouse.cleanUp();
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

    deploy(orb: Orb, facilities: Array<FacilityItem>, profile: Profile): boolean {
        if (orb.owner !== profile) return false;
        facilities.forEach(item => {
            orb.addFacility(item.facility);
            item.amount--;
        });
        profile.warehouse.cleanUp();
        this.game.displayMessage(new I18nText("game.actions.message.deployed_miners_to_orb", {
            "user": profile.name,
            "orb_name": orb.name,
            "orb_uid": orb.uid,
            "facility_amount": facilities.length,
        }));
        return true;
    }

}