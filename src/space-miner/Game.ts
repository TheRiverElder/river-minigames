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
import RandomOrbGenerator from "./model/generation/RandomOrbGenerator";
import StellarOrbGenerator from "./model/generation/StellarOrbGenerator";
import TerraLikeOrbGenerator from "./model/generation/TerraLikeOrbGenerator";
import OrbMiningLicenceItem from "./model/item/OrbMiningLisenceItem";
import Orb from "./model/orb/Orb";
import Profile from "./model/Profile";
import { RESOURCE_TYPES, ResourceTypes } from "./model/misc/ResourceTypes";
import Shop from "./model/Shop";
import SpaceExploringCenter from "./model/SpaceExploringCenter";
import Technology from "./model/technology/Technology";
import World from "./model/World";
import TerraLikeOrb from "./model/orb/TerraLikeOrb";
import WeightedRandom from "../libs/math/WeightedRandom";
import { ResourceGenerationData } from "./model/generation/ResourceGenerationData";
import BasicPersistor from "./model/io/BasicPersistor";
import Facility from "./model/facility/Facility";
import Item from "./model/item/Item";
import Level from "./model/level/Level";
import MoneyAmountGoal from "./model/level/MoneyAmountGoal";
import GuideLevel from "./model/level/GuideLevel";
import ResourceAmountGoal from "./model/level/ResourceAmountGoal";
import LevelCheckedGoal from "./model/level/LevelCheckedGoal";
import SpecificResourceAmountGoal from "./model/level/SpecificResourceGoal";

export default class Game {

    readonly facilityPersistor = new BasicPersistor<Facility>();
    readonly itemPersistor = new BasicPersistor<Item>();

    readonly actions = new GameActions(this);

    readonly world = new World(this);
    readonly profile = new Profile();
    readonly shop = new Shop(this);
    readonly technologies = new Set<Technology>();
    readonly recipes = new Registry<string, Recipe>(recipe => recipe.name);
    readonly spaceExploringCenter = new SpaceExploringCenter(createOrbGenerator());
    readonly level: Level = createDefaultLevel(this);

    readonly uidGenerator = new IncrementNumberGenerator(1);

    createAndAddOrb(createOrb: Productor<[Game, int], Orb>): Orb {
        const orb = createOrb([this, this.uidGenerator.generate()]);
        this.profile.ownedOrbs.add(orb);
        return orb;
    }

    tick() {
        this.doPreTick();
        this.doTick();
        this.doPostTick();
        this.listeners.UI_UPDATE.emit();
    }

    private doPreTick() {
        this.spaceExploringCenter.preTick(this);
        this.shop.preTick(this);
        this.world.preTick(this);
        this.listeners.PRE_TICK.emit();
    }

    private doTick() {
        this.spaceExploringCenter.tick(this);
        this.shop.tick(this);
        this.world.tick(this);
        this.listeners.TICK.emit();
    }

    private doPostTick() {
        this.spaceExploringCenter.postTick(this);
        this.shop.postTick(this);
        this.world.postTick(this);
        this.level.postTick(this);
        this.listeners.POST_TICK.emit();
    }

    discoverAndUpdateShop() {
        const orb = this.spaceExploringCenter.discover(this.world);
        const item = new OrbMiningLicenceItem(this.world.game, orb);
        this.shop.items.push(item);
        this.displayMessage(new I18nText("game.game.message.discovered_orb", {
            "name": orb.name,
            "uid": orb.uid,
        }));
    }

    // 以下为UI相关
    readonly listeners = {
        MESSAGE: new ListenerManager<Text>(),
        OVERLAY: new ListenerManager<any>(),
        PRE_TICK: new ListenerManager(),
        TICK: new ListenerManager(),
        POST_TICK: new ListenerManager(),
        UI_UPDATE: new ListenerManager(),
    };

    displayMessage(message: Text | string) {
        return this.listeners.MESSAGE.emit(typeof message === "string" ? new PlainText(message) : message);
    }

}

const RESOURCE_DATA_MAPPER: Productor<ResourceGenerationData, [ResourceGenerationData, number]> = v => [v, v.weight];

function createOrbGenerator() {
    const terraLikeOrbGenerator = new TerraLikeOrbGenerator({
        layers: [
            { // 生成地心熔岩
                layerType: TerraLikeOrb.LAYER_CORE,
                thicknessRatioGenerator: random => 0.30,
                resourceRandom: new WeightedRandom([
                    { type: ResourceTypes.CORE_LAVA, weight: 1000, veinSize: () => rand(50, 150) * 1e9 },
                ].map(RESOURCE_DATA_MAPPER)),
            },
            { // 生成地幔矿物
                layerType: TerraLikeOrb.LAYER_MANTLE,
                thicknessRatioGenerator: random => 0.50,
                resourceRandom: new WeightedRandom([
                    { type: ResourceTypes.ROCK, weight: 150, veinSize: () => rand(80, 120) * 1e10 },
                    { type: ResourceTypes.STRUCTIUM_ORE, weight: 150, veinSize: () => rand(200, 300) * 1e9 },
                    { type: ResourceTypes.SILVER_ORE, weight: 50, veinSize: () => rand(50, 150) * 1e9 },
                    { type: ResourceTypes.GOLD_ORE, weight: 12, veinSize: () => rand(50, 150) * 1e9 },
                    { type: ResourceTypes.URANIUM_ORE, weight: 8, veinSize: () => rand(50, 150) * 1e9 },
                    { type: ResourceTypes.RESONATING_CRYSTAL, weight: 1, veinSize: () => rand(30, 80) * 1e9 },
                ].map(RESOURCE_DATA_MAPPER)),
            },
            { // 生成地壳矿物
                layerType: TerraLikeOrb.LAYER_CRUST,
                thicknessRatioGenerator: random => 0.15,
                resourceRandom: new WeightedRandom([
                    { type: ResourceTypes.ROCK, weight: 100, veinSize: () => rand(80, 120) * 1e10 },
                    { type: ResourceTypes.COAL, weight: 70, veinSize: () => rand(450, 550) * 1e9 },
                    { type: ResourceTypes.STRUCTIUM_ORE, weight: 50, veinSize: () => rand(200, 300) * 1e9 },
                    { type: ResourceTypes.SILVER_ORE, weight: 20, veinSize: () => rand(50, 150) * 1e9 },
                    { type: ResourceTypes.GOLD_ORE, weight: 5, veinSize: () => rand(50, 150) * 1e9 },
                    { type: ResourceTypes.URANIUM_ORE, weight: 2, veinSize: () => rand(50, 150) * 1e9 },
                ].map(RESOURCE_DATA_MAPPER)),
            },
            { // 生成地表矿物
                layerType: TerraLikeOrb.LAYER_SURFACE,
                thicknessRatioGenerator: random => 0.05,
                resourceRandom: new WeightedRandom([
                    { type: ResourceTypes.ROCK, weight: 10, veinSize: () => rand(80, 120) * 1e10 },
                    { type: ResourceTypes.WATER, weight: 70, veinSize: () => rand(50, 150) * 1e9 },
                    { type: ResourceTypes.WOOD, weight: 10, veinSize: () => rand(150, 250) * 1e9 },
                    { type: ResourceTypes.BIOMASS, weight: 10, veinSize: () => rand(50, 150) * 1e9 },
                ].map(RESOURCE_DATA_MAPPER)),
            },
        ],
    });

    const stellarOrbGenerator = new StellarOrbGenerator();

    return new RandomOrbGenerator([
        [terraLikeOrbGenerator, 8],
        [stellarOrbGenerator, 2],
    ]);
}

function createDefaultLevel(game: Game): Level {
    return new GuideLevel(game, [
        new LevelCheckedGoal(),
        new ResourceAmountGoal(game, 100, it => it.name === "Terra"),
        new SpecificResourceAmountGoal(game, ResourceTypes.STRUCTIUM, 100, it => it.name === "Terra"),
        new MoneyAmountGoal(game, 2 * (game.profile.account || 100000)),
    ]);
}