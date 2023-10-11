import { double } from "../../../libs/CommonTypes";
import { sumBy } from "../../../libs/lang/Collections";
import Game from "../../Game";
import Item from "../item/Item";
import { InOrbLocation } from "../orb/Orb";
import Profile from "../Profile";
import Miner from "./Miner";
import MinerPart from "./MinerPart";
import MinerPartType from "./MinerPartType";
import { MINER_PART_TYPE_MAIN_CONTROL } from "./MinerPartTypes";

export default class MainControlPart extends MinerPart<MainControlPart> {

    readonly downSpeed: double;
    status: "resting" | "digging" | "retreating" = "resting";
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

    override setup(miner: Miner, location: InOrbLocation): void {
        this.status = "resting";
        this.prepareNextTrip(miner);
    }

    override dispose(miner: Miner, location: InOrbLocation): void {
        this.status = "resting";
        this.thisTickGained = false;
        this.lastTickProduct = 0;
        miner.listenerGain.remove(this.onGain);
    }

    onGain = (items: Array<Item>) => {
        this.lastTickProduct = sumBy(items, it => it.amount);
        this.thisTickGained = true;
    };

    override preTick(miner: Miner, location: InOrbLocation, profile: Profile, game: Game): void {
        this.thisTickGained = false;
    }

    override tick(miner: Miner, location: InOrbLocation, profile: Profile, game: Game): void {
        switch (this.status) {
            case "resting": {
                if (miner.frame.energy >= miner.frame.maxEnergy && miner.cargo.inventory.empty) {
                    this.status = "digging";
                    this.prepareNextTrip(miner);
                }
                break;
            }
            case "digging": {
                if (miner.energy <= 0 || miner.inventory.full) {
                    this.status = "retreating";
                } else {
                    if (location.depth < location.orb.body.radius) {
                        if (this.shouldMove) miner.frame.move(miner, location, this.downSpeed, false, profile, game);
                    }
                    miner.collector.collect(miner, location, profile, game);
                }
                break;
            }
            case "retreating": {
                if (location.depth > 0) {
                    const upSpeed = this.downSpeed * 2.5;
                    miner.frame.move(miner, location, -upSpeed, true, profile, game);
                } else {
                    this.status = "resting";
                }
                break;
            }
        }
    }

    override postTick(miner: Miner, location: InOrbLocation, profile: Profile, game: Game): void {
        this.shouldMove = !this.thisTickGained;
    }

    override copy(): MainControlPart {
        return new MainControlPart(this.downSpeed);
    }

    override equals(another: MinerPart): boolean {
        return another instanceof MainControlPart;
    }

    prepareNextTrip(miner: Miner) {
        this.thisTickGained = false;
        this.lastTickProduct = 0;
        miner.listenerGain.add(this.onGain);
    }
}