import { Component, ReactNode } from "react";
import { removeFromArray } from "../../libs/lang/Collections";
import { Nullable } from "../../libs/lang/Optional";
import Game from "../Game";
import Item from "../model/item/Item";
import MinerItem from "../model/item/MinerItem";
import MinerPartItem from "../model/item/MinerPartItem";
import CargoPart from "../model/miner/CargoPart";
import CollectorPart from "../model/miner/CollectorPart";
import FramePart from "../model/miner/FramePart";
import MainControlPart from "../model/miner/MainControlPart";
import Miner from "../model/miner/Miner";
import MinerPart from "../model/miner/MinerPart";
import MinerPartType from "../model/miner/MinerPartType";
import { MINER_PART_TYPES, MINER_PART_TYPE_ADDITION, MINER_PART_TYPE_CARGO, MINER_PART_TYPE_COLLECTOR, MINER_PART_TYPE_FRAME, MINER_PART_TYPE_MAIN_CONTROL } from "../model/miner/MinerPartTypes";
import Profile from "../model/Profile";
import "./AssemblerView.scss";

export interface AssemblerViewProps {
    profile: Profile;
    game: Game;
}

export interface AssemblerViewState {
    appendedItemList: Array<MinerPartItem>;
    unappendedItemList: Array<MinerPartItem>;
    justSucceededAssembling: boolean;
}

export default class AssemblerView extends Component<AssemblerViewProps, AssemblerViewState> {

    constructor(props: AssemblerViewProps) {
        super(props);
        this.state = {
            appendedItemList: [],
            unappendedItemList: this.getMinerParts(props.profile.warehouse.items),
            justSucceededAssembling: false,
        };
    }
    
    override render(): ReactNode {

        const { appendedItemList, unappendedItemList } = this.state;

        return (
            <div className="AssemblerView">
                <div className="assembling-panel">
                    <div className="appended-list">
                        {appendedItemList.map((item, i) => (
                            <div key={i} className="item">
                                <div className="image-wrapper">
                                    <img src={item.image} alt={item.part.type.name}/>
                                </div>
                                <div className="detail">
                                    <div className="name">{item.part.type.name.toUpperCase()}</div>
                                    <div className="description">{this.renderPart(item.part)}</div>
                                </div>
                                <button onClick={() => this.unappend(item)}>移除</button>
                            </div>
                        ))}
                    </div>
                    <div className="hint">
                        <div>{this.gethint()}</div>
                        <button disabled={!this.canAssemble()} onClick={() => this.assemble()}>组装！</button>
                    </div>
                </div>
                <div className="unappended-list">
                    {unappendedItemList.map((item, i) => (
                        <div className="item">
                            <div className="image-wrapper">
                                <img src={item.image} alt={item.part.type.name}/>
                            </div>
                            <div className="detail">
                                <div key={i} className="name">{item.part.type.name.toUpperCase()}</div>
                                <div className="description">{this.renderPart(item.part)}</div>
                            </div>
                            <button onClick={() => this.append(item)}>添加</button>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    gethint(): string {
        if (this.state.justSucceededAssembling) return `组装成功！`;
        const missingPartTypes = new Set<MinerPartType>(MINER_PART_TYPES.slice());
        missingPartTypes.delete(MINER_PART_TYPE_ADDITION);
        for (const item of this.state.appendedItemList) {
            missingPartTypes.delete(item.part.type);
        }
        if (missingPartTypes.size > 0) return `缺失以下类型的部件：${Array.from(missingPartTypes, type => type.name)}`;
        return `无问题，可以组装`;
    }

    canAssemble(): boolean {
        const missingPartTypes = new Set<MinerPartType>(MINER_PART_TYPES.slice());
        missingPartTypes.delete(MINER_PART_TYPE_ADDITION);
        for (const item of this.state.appendedItemList) {
            missingPartTypes.delete(item.part.type);
        }
        if (missingPartTypes.size > 0) return false;
        return true;
    }

    getMinerParts(items: Array<Item>): Array<MinerPartItem> {
        return items
            .filter(item => item.type === MinerPartItem.TYPE)
            .map(item => (item as MinerPartItem));
    }

    append(part: MinerPartItem): boolean {
        const unappendedItemList = this.state.unappendedItemList.slice();
        if (!removeFromArray(unappendedItemList, part)) return false;
    
        const appendedItemList = this.state.appendedItemList.slice();
        appendedItemList.push(part);
        this.setState({
            unappendedItemList,
            appendedItemList,
            justSucceededAssembling: false,
        });

        return true;
    }

    unappend(part: MinerPartItem): boolean {
        const appendedItemList = this.state.appendedItemList.slice();
        if (!removeFromArray(appendedItemList, part)) return false;
    
        const unappendedItemList = this.state.unappendedItemList.slice();
        unappendedItemList.push(part);
        this.setState({
            unappendedItemList,
            appendedItemList,
            justSucceededAssembling: false,
        });

        return true;
    }

    assemble() {
        const { game, profile } = this.props;

        let frame: Nullable<FramePart> = null;
        let mainControl: Nullable<MainControlPart> = null;
        let cargo: Nullable<CargoPart> = null;
        let collector: Nullable<CollectorPart> = null;
        let additions: Array<MinerPart> = [];

        const appendedItemList = this.state.appendedItemList;
        for (let index = 0; index < appendedItemList.length; index++) {
            const item = appendedItemList[index];
            const part = item.part;

            switch (part.type) {
                case MINER_PART_TYPE_FRAME: frame = part as FramePart; break;
                case MINER_PART_TYPE_MAIN_CONTROL: mainControl = part as MainControlPart; break;
                case MINER_PART_TYPE_CARGO: cargo = part as CargoPart; break;
                case MINER_PART_TYPE_COLLECTOR: collector = part as CollectorPart; break;
                case MINER_PART_TYPE_ADDITION: additions.push(part); break;
            };
        }

        if (!frame || !mainControl || !cargo || !collector) {
            game.onMessageListener.emit(`挖矿姬组装失败：部件确实，请检查部件！`);
            return;
        }

        const miner = new Miner({
            frame,
            mainControl,
            cargo,
            collector,
            additions,
        });

        if (profile.warehouse.removeExactAll(appendedItemList.map(item => item.copy(1))).length != appendedItemList.length) {
            game.onMessageListener.emit(`挖矿姬组装失败：调货出错，请检查总货舱物品是否缺失！`);
            return;
        }
        profile.warehouse.add(new MinerItem(miner));
        this.setState({ appendedItemList: [], justSucceededAssembling: true });
        game.onMessageListener.emit(`挖矿姬组装成功！`);
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
                    <div>附加部件</div>
                );
            }
        }
    }
}