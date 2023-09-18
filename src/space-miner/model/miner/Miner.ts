import { double } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import { InOrbLocation } from "../orb/Orb";
import Game from "../../Game";
import MinerPart from "./MinerPart";
import CargoPart from "./CargoPart";
import CollectorPart from "./CollectorPart";
import Profile from "../Profile";
import FramePart from "./FramePart";
import Inventory from "../Inventory";
import MainControlPart from "./MainControlPart";
import Item from "../item/Item";
import ListenerManager from "../../../libs/management/ListenerManager";
import Facility from "../facility/Facility";
import Text from "../../../libs/i18n/Text";
import I18nText from "../../../libs/i18n/I18nText";

export interface MinerAssemble {
    frame: FramePart;
    mainControl: MainControlPart;
    cargo: CargoPart;
    collector: CollectorPart;
    additions: Array<MinerPart>;
}

export default class Miner extends Facility {

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
        super();
        this.frame = assemble.frame;
        this.mainControl = assemble.mainControl;
        this.cargo = assemble.cargo;
        this.collector = assemble.collector;
        this.additions = assemble.additions.slice();
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

    tick(game: Game) {
        const energyCostPerSize = 0.5;
        const energyCost = energyCostPerSize * this.size;
        if (this.location && this.energy >= energyCost) {
            this.frame.mutateEnergy(-energyCost);
            this.work(this.location, game.profile, game);
        }
    }

    work(location: InOrbLocation, profile: Profile, game: Game) {
        const parts = [
            this.frame, 
            this.mainControl, 
            this.cargo, 
            this.collector, 
            ...this.additions,
        ];
        parts.forEach(part => part.preTick(this, location, profile, game));
        parts.forEach(part => part.tick(this, location, profile, game));
        parts.forEach(part => part.postTick(this, location, profile, game));
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