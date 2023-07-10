import { int } from "../../libs/CommonTypes";
import Registry from "../../libs/management/Registry";
import City from "./City";
import { Era } from "./Constants";
import FactoryPattern from "./FactoryPattern";
import FactorySlot from "./FactorySlot";
import IndustrySlot from "./IndustrySlot";
import Link from "./Link";
import Market from "./Market";
import MerchantSlot from "./MerchantSlot";
import Profile from "./Profile";


export default class Game {

    readonly factoryPatterns = new Registry<int, FactoryPattern>(it => it.uid);
    readonly markets = new Map<string, Market>();
    readonly cities = new Registry<string, City>(it => it.name);
    readonly factorySlots = new Registry<int, FactorySlot>(it => it.uid);
    readonly industrySlots = new Registry<int, IndustrySlot>(it => it.uid);
    readonly merchantSlots = new Registry<int, MerchantSlot>(it => it.uid);
    readonly links = new Registry<int, Link>(it => it.uid);
    readonly profiles = new Registry<number, Profile>(it => it.uid); 
    era: Era = "canal";
    roundCounter: int = 0;
    currentOrdinal: number = 0;


    static load(data: any): Game {
        const game = new Game();
        data.factoryPatterns.forEach((it: any) => game.factoryPatterns.add(FactoryPattern.load(it)));
        data.cities.forEach((it: any) => game.cities.add(City.load(it)));
        data.industrySlots.forEach((it: any) => game.industrySlots.add(IndustrySlot.load(it, game)));
        data.merchantSlots.forEach((it: any) => game.merchantSlots.add(MerchantSlot.load(it, game)));
        data.factorySlots.forEach((it: any) => game.factorySlots.add(FactorySlot.load(it, game)));
        data.links.forEach((it: any) => game.links.add(Link.load(it, game)));
        data.profiles.forEach((it: any) => game.profiles.add(Profile.load(it, game)));
        game.era = data.era;
        game.roundCounter = data.roundCounter;
        game.currentOrdinal = data.currentOrdinal;

        return game;
    }
}