import { Component, ReactNode } from "react";
import { Nullable } from "../../libs/lang/Optional";
import Game from "../Game";
import CargoPart from "../model/miner/CargoPart";
import CollectorPart from "../model/miner/CollectorPart";
import FramePart from "../model/miner/FramePart";
import MainControlPart from "../model/miner/MainControlPart";
import MinerPart from "../model/miner/MinerPart";
import { MINER_PART_TYPE_ADDITION, MINER_PART_TYPE_CARGO, MINER_PART_TYPE_COLLECTOR, MINER_PART_TYPE_FRAME, MINER_PART_TYPE_MAIN_CONTROL } from "../model/miner/MinerPartTypes";
import Profile from "../model/Profile";

export interface AssemblerViewProps {
    profile: Profile;
    game: Game;
}

export interface AssemblerViewState {
    frame: Nullable<FramePart>;
    mainControl: Nullable<MinerPart>;
    cargo: Nullable<CargoPart>;
    collector: Nullable<CollectorPart>;
    additions: Array<MinerPart>;
}

export default class AssemblerView extends Component<AssemblerViewProps, AssemblerViewState> {

    constructor(props: AssemblerViewProps) {
        super(props);
        this.state = {
            frame: null,
            mainControl: null,
            cargo: null,
            collector: null,
            additions: [],
        };
    }
    
    override render(): ReactNode {

        const { game, profile } = this.props;

        return (
            <div className="AssemblerView">
                <div></div>
            </div>
        );
    }

    canAppend(part: MinerPart): boolean {
        
    }

    renderPart(part: MinerPart) {
        switch(part.type) {
            case MINER_PART_TYPE_FRAME: {
                const frame = part as FramePart;
                return (
                    <div>能源：{frame.energy / frame.maxEnergy}，规模：{frame.size}</div>
                );
            }
            case MINER_PART_TYPE_MAIN_CONTROL: {
                const control = part as MainControlPart;
                return (
                    <div>主控</div>
                );
            }
            case MINER_PART_TYPE_CARGO: {
                const cargo = part as CargoPart;
                return (
                    <div>容量：{cargo.capacity}</div>
                );
            }
            case MINER_PART_TYPE_COLLECTOR: {
                const collector = part as CollectorPart;
                return (
                    <div>可挖掘：{collector.mineableResourceType.name}，力量：{collector.strength}</div>
                );
            }
            case MINER_PART_TYPE_ADDITION: {
                return (
                    <div>能源：{frame.energy / frame.maxEnergy}，规模：{frame.size}</div>
                );
            }
        }
    }
}