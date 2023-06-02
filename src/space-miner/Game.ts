import { int, Productor } from "../libs/CommonTypes";
import I18nText from "../libs/i18n/I18nText";
import PlainText from "../libs/i18n/PlainText";
import Text from "../libs/i18n/Text";
import ListenerManager from "../libs/management/ListenerManager";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import WeightedRandom from "../libs/math/WeightedRandom";
import OrbGenerator from "./model/generation/OrbGenerator";
import Inventory from "./model/Inventory";
import Item from "./model/item/Item";
import OrbMiningLisenceItem from "./model/item/OrbMiningLisenceItem";
import Miner from "./model/miner/Miner";
import Orb from "./model/Orb";
import Profile from "./model/Profile";
import { RESOURCE_TYPE_WATER, RESOURCE_TYPE_WOOD, RESOURCE_TYPE_COAL, RESOURCE_TYPE_IRON_ORE, RESOURCE_TYPE_COPPER_ORE, RESOURCE_TYPE_GOLD_ORE, RESOURCE_TYPE_URANIUM_ORE, RESOURCE_TYPE_CORE_LAVA } from "./model/ResourceTypes";
import Shop from "./model/Shop";
import SpaceExploringCenter from "./model/SpaceExploringCenter";
import World from "./model/World";

export default class Game {

    readonly world = new World();
    readonly profile = new Profile();
    readonly shop = new Shop(this);
    readonly spaceExploringCenter = new SpaceExploringCenter(createOrbGenerator());

    readonly uidGenerator = new IncrementNumberGenerator(1);

    createAndAddOrb(createOrb: Productor<[Game, int], Orb>): Orb {
        const orb = createOrb([this, this.uidGenerator.generate()]);
        this.profile.ownedOrbs.add(orb);
        return orb;
    }

    tick() {
        this.spaceExploringCenter.tick(this);
        this.world.tick(this);
        this.onTickListener.emit();
    }

    refillMinerEnergy(miner: Miner) {
        const energyPrice = 10;
        const refilledEnergy = Math.min(miner.frame.maxEnergy - miner.frame.energy, this.profile.account / energyPrice);
        this.profile.account -= refilledEnergy * energyPrice;
        miner.frame.mutateEnergy(refilledEnergy);
    }

    discoverAndUpdateShop() {
        const orb = this.spaceExploringCenter.discover(this.world);
        const item = new OrbMiningLisenceItem(orb);
        this.shop.items.push(item);
        this.displayMessage(new I18nText("game.game.message.discovered_orb", {
            "name": orb.name,
            "uid": orb.uid,
        }));
    }
    
    useItem(item: Item, inventory: Inventory, profile: Profile) {
        const previousAmount = item.amount;
        const succeeded = item.onUse(profile, this);
        inventory.cleanUp();
        if (succeeded) this.displayMessage(new I18nText("game.game.message.used_item", {
            "user": profile.name,
            "item": item.name,
            "amount": previousAmount - item.amount,
        }));
    }

    // 以下为UI相关

    readonly onMessageListener = new ListenerManager<Text>();
    readonly onTickListener = new ListenerManager();
    
    displayMessage(message: Text | string) {
        return this.onMessageListener.emit(typeof message === "string" ? new PlainText(message) : message);
    }

}

function createOrbGenerator() {
    const orbRandom = new WeightedRandom([
        [RESOURCE_TYPE_WATER, 30],
        [RESOURCE_TYPE_WOOD, 10],
        [RESOURCE_TYPE_COAL, 20],
        [RESOURCE_TYPE_IRON_ORE, 10],
        [RESOURCE_TYPE_COPPER_ORE, 40],
        [RESOURCE_TYPE_GOLD_ORE, 7],
        [RESOURCE_TYPE_URANIUM_ORE, 1],
        [RESOURCE_TYPE_CORE_LAVA, 90],
    ]);
    return new OrbGenerator(orbRandom);
}