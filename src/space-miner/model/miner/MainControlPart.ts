import { double } from "../../../libs/CommonTypes";
import { sumBy } from "../../../libs/lang/Collections";
import Game from "../../Game";
import Item from "../item/Item";
import Profile from "../Profile";
import Miner, { MinerLocation } from "./Miner";
import MinerPart from "./MinerPart";
import MinerPartType from "./MinerPartType";
import { MINER_PART_TYPE_MAIN_CONTROL } from "./MinerPartTypes";

export default class MainControlPart extends MinerPart<MainControlPart> {

    readonly downSpeed: double;
    finishedCollecting: boolean = false;
    thisTickGained: boolean = false;
    lastTickProduct: double = 0;
    shouldMove: boolean = true;

    constructor(downSpeed: double) {
        super();
        this.downSpeed = downSpeed;
    }

    get type(): MinerPartType {
        return MINER_PART_TYPE_MAIN_CONTROL;
    }

    override setup(miner: Miner, location: MinerLocation): void {
        this.finishedCollecting = false;
        this.thisTickGained = false;
        this.lastTickProduct = 0;
        miner.listenerGain.add(this.onGain);
    }

    override dispose(miner: Miner, location: MinerLocation): void {
        this.finishedCollecting = false;
        this.thisTickGained = false;
        this.lastTickProduct = 0;
        miner.listenerGain.remove(this.onGain);
    }

    onGain = (items: Array<Item>) => {
        this.lastTickProduct = sumBy(items, it => it.amount);
        this.thisTickGained = true;
    };

    override preTick(miner: Miner, location: MinerLocation, profile: Profile, game: Game): void {
        this.thisTickGained = false;
    }

    override tick(miner: Miner, location: MinerLocation, profile: Profile, game: Game): void {
        if (!this.finishedCollecting && (miner.energy <= 0 || miner.inventory.full)) this.finishedCollecting = true;
        if (this.finishedCollecting) {
            const upSpeed = this.downSpeed * 2.5;
            miner.frame.move(miner, location, -upSpeed, true, profile, game);
        } else {
            if (this.shouldMove) miner.frame.move(miner, location, this.downSpeed, false, profile, game);
            miner.collector.collect(miner, location, profile, game);
        }
    }

    override postTick(miner: Miner, location: MinerLocation, profile: Profile, game: Game): void {
        this.shouldMove = !this.thisTickGained;
    }

    override copy(): MainControlPart {
        return new MainControlPart(this.downSpeed);
    }

    override equals(another: MinerPart): boolean {
        return another instanceof MainControlPart;
    }
}