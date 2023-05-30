import { int, Productor } from "../libs/CommonTypes";
import ListenerManager from "../libs/management/ListenerManager";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import Inventory from "./model/Inventory";
import Item from "./model/item/Item";
import OrbMiningLisenceItem from "./model/item/OrbMiningLisenceItem";
import Miner from "./model/Miner";
import Orb from "./model/Orb";
import Profile from "./model/Profile";
import Shop from "./model/Shop";
import SpaceExploringCenter from "./model/SpaceExploringCenter";
import World from "./model/World";

export default class Game {

    readonly world = new World();
    readonly profile = new Profile();
    readonly shop = new Shop(this);
    readonly spaceExploringCenter = new SpaceExploringCenter();

    readonly uidGenerator = new IncrementNumberGenerator(1);

    createAndAddOrb(createOrb: Productor<[Game, int], Orb>): Orb {
        const orb = createOrb([this, this.uidGenerator.generate()]);
        this.profile.ownedOrbs.add(orb);
        return orb;
    }

    tick() {
        this.spaceExploringCenter.tick(this);
        this.world.tick(this);
    }

    refillMinerEnergy(miner: Miner) {
        const energyPrice = 10;
        const refilledEnergy = Math.min(miner.maxEnergy - miner.energy, this.profile.account / energyPrice);
        this.profile.account -= refilledEnergy * energyPrice;
        miner.energy += refilledEnergy;
    }

    discoverAndUpdateShop() {
        const orb = this.spaceExploringCenter.discover(this.world);
        const item = new OrbMiningLisenceItem(orb);
        this.shop.items.push(item);
    }
    
    useItem(item: Item, inventory: Inventory, profile: Profile) {
        item.onUse(profile, this);
        inventory.cleanUp();
    }

    // 以下为UI相关
    
    readonly onMessageListener = new ListenerManager<string>();

}