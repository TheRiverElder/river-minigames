import I18nText from "../../../libs/i18n/I18nText";
import FacilityItem from "../item/FacilityItem";
import Item from "../item/Item";
import Miner from "../miner/Miner";
import Inventory from "../misc/storage/Inventory";
import Orb from "../orb/Orb";
import Technology from "../technology/Technology";
import Game from "./Game";
import Profile from "./Profile";

;

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
        const tokenItem = inventory.removeExact(item);
        if (tokenItem.amount <= 0) return;
        const previousAmount = tokenItem.amount;
        const succeeded = tokenItem.onUse(profile, this.game);
        inventory.add(tokenItem);
        inventory.cleanUp();
        if (succeeded) this.game.displayMessage(new I18nText("game.game.message.used_item", {
            "user": profile.name,
            "item": item.displayedName,
            "amount": previousAmount - tokenItem.amount,
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

    openAssemblerUi(orb: Orb) {
        const assembler = orb.assembler;
        assembler.onOpenUi(orb);
    }

    closeAssemblerUi(orb: Orb) {
        const assembler = orb.assembler;
        assembler.onCloseUi();
    }

}