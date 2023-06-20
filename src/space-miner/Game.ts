import { int, Productor } from "../libs/CommonTypes";
import I18nText from "../libs/i18n/I18nText";
import PlainText from "../libs/i18n/PlainText";
import Text from "../libs/i18n/Text";
import ListenerManager from "../libs/management/ListenerManager";
import Registry from "../libs/management/Registry";
import IncrementNumberGenerator from "../libs/math/IncrementNumberGenerator";
import { rand } from "../libs/math/Mathmatics";
import GameActions from "./GameActions";
import Recipe from "./model/assemble/Recipe";
import TerraLikeOrbGenerator from "./model/generation/TerraLikeOrbGenerator";
import OrbMiningLisenceItem from "./model/item/OrbMiningLisenceItem";
import Orb from "./model/orb/Orb";
import Profile from "./model/Profile";
import { RESOURCE_TYPE_WATER, RESOURCE_TYPE_WOOD, RESOURCE_TYPE_COAL, RESOURCE_TYPE_IRON_ORE, RESOURCE_TYPE_COPPER_ORE, RESOURCE_TYPE_GOLD_ORE, RESOURCE_TYPE_URANIUM_ORE, RESOURCE_TYPE_CORE_LAVA } from "./model/ResourceTypes";
import Shop from "./model/Shop";
import SpaceExploringCenter from "./model/SpaceExploringCenter";
import Technology from "./model/technology/Technology";
import World from "./model/World";

export default class Game {

    readonly actions = new GameActions(this);

    readonly world = new World();
    readonly profile = new Profile();
    readonly shop = new Shop(this);
    readonly technologies = new Set<Technology>();
    readonly recipes = new Registry<string, Recipe>(recipe => recipe.name);
    readonly spaceExploringCenter = new SpaceExploringCenter(createOrbGenerator());

    readonly uidGenerator = new IncrementNumberGenerator(1);

    createAndAddOrb(createOrb: Productor<[Game, int], Orb>): Orb {
        const orb = createOrb([this, this.uidGenerator.generate()]);
        this.profile.ownedOrbs.add(orb);
        return orb;
    }

    tick() {
        this.spaceExploringCenter.tick(this);
        this.shop.tick(this);
        this.world.tick(this);
        this.onTickListener.emit();
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

    // 以下为UI相关

    readonly onMessageListener = new ListenerManager<Text>();
    readonly onOverlayListener = new ListenerManager<any>();
    readonly onTickListener = new ListenerManager();
    
    displayMessage(message: Text | string) {
        return this.onMessageListener.emit(typeof message === "string" ? new PlainText(message) : message);
    }

}

function createOrbGenerator() {
    return new TerraLikeOrbGenerator([
        {
            type: RESOURCE_TYPE_WATER,
            weight: 30,
            veinSize: () => rand(1e8, 5e10),
        },
        {
            type: RESOURCE_TYPE_WOOD,
            weight: 10,
            veinSize: () => rand(1e4, 5e6),
        },
        {
            type: RESOURCE_TYPE_COAL,
            weight: 20,
            veinSize: () => rand(1e4, 5e6),
        },
        {
            type: RESOURCE_TYPE_IRON_ORE,
            weight: 10,
            veinSize: () => rand(3e3, 8e3),
        },
        {
            type: RESOURCE_TYPE_COPPER_ORE,
            weight: 40,
            veinSize: () => rand(3e3, 8e3),
        },
        {
            type: RESOURCE_TYPE_GOLD_ORE,
            weight: 7,
            veinSize: () => rand(1e3, 2e3),
        },
        {
            type: RESOURCE_TYPE_URANIUM_ORE,
            weight: 1,
            veinSize: () => rand(3e3, 8e3),
        },
        {
            type: RESOURCE_TYPE_CORE_LAVA,
            weight: 90,
            veinSize: () => rand(3e10, 5e11),
        },
    ]);
}