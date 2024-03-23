import { double } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import { InOrbLocation } from "../orb/Orb";
import Game from "../global/Game";
import MinerPart from "./MinerPart";
import CargoPart from "./CargoPart";
import CollectorPart from "./CollectorPart";
import FramePart from "./FramePart";
import MainControlPart from "./MainControlPart";
import Item from "../item/Item";
import ListenerManager from "../../../libs/management/ListenerManager";
import Text from "../../../libs/i18n/Text";
import I18nText from "../../../libs/i18n/I18nText";
import Inventory from "../misc/storage/Inventory";

export interface MinerAssemble {
    frame: FramePart;
    mainControl: MainControlPart;
    cargo: CargoPart;
    collector: CollectorPart;
    additions: Array<MinerPart>;
}

export default class Miner {

    name: string = "";

    get displayedName(): Text {
        return new I18nText(`facility.miner.name`);
    }

    get description(): Text {
        return new I18nText(`facility.miner.description`);
    }

    frame: FramePart;
    mainControl: MainControlPart;
    cargo: CargoPart;
    collector: CollectorPart;
    additions: Array<MinerPart>;

    location: Nullable<InOrbLocation> = null;

    get size(): double { return this.frame.size; }
    get energy(): double { return this.frame.energy; }
    get maxEnergy(): double { return this.frame.maxEnergy; }
    get inventory(): Inventory { return this.cargo.inventory; }

    constructor(assemble: MinerAssemble) {
        this.frame = assemble.frame;
        this.mainControl = assemble.mainControl;
        this.cargo = assemble.cargo;
        this.collector = assemble.collector;
        this.additions = assemble.additions.slice();
    }

    get workingParts(): Array<MinerPart> {
        return [
            this.frame, 
            this.mainControl, 
            this.cargo, 
            this.collector, 
            ...this.additions,
        ];
    }

    setup() {
        const location = this.location;
        if (!location) return;
        [
            this.frame, 
            this.mainControl, 
            this.cargo, 
            this.collector, 
            ...this.additions,
        ].forEach(part => part.setup(this, location));
    }

    preTick(game: Game) {
        if (this.location) {
            this.workingParts.forEach(part => part.preTick(this, this.location!!, game.profile, game));
        }
    }

    tick(game: Game) {
        const energyCostPerSize = 0.5;
        const energyCost = energyCostPerSize * this.size;
        if (this.location) {
            if (this.mainControl.status === "digging") {
                this.frame.mutateEnergy(-energyCost);
            }
            this.workingParts.forEach(part => part.tick(this, this.location!!, game.profile, game));
        }
    }

    postTick(game: Game) {
        this.workingParts.forEach(part => part.postTick(this, this.location!!, game.profile, game));
    }
    
    readonly listenerGain = new ListenerManager<Array<Item>>();

    // 收获时调用并触发
    gain(items: Array<Item>) {
        const gainedItems = items.filter(it => it.amount > 0); 
        gainedItems.forEach(it => this.inventory.add(it));
        this.listenerGain.emit(gainedItems);
    }

    copy(): Miner {
        return new Miner({
            frame: this.frame,
            mainControl: this.mainControl,
            cargo: this.cargo,
            collector: this.collector,
            additions: this.additions.map(it => it.copy()),
        });
    }
}