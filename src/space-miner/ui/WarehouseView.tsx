import { Component, ReactNode } from "react";
import { int, Pair } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Inventory from "../model/Inventory";
import Item from "../model/item/Item";
import MinerItem from "../model/item/MinerItem";
import OrbMiningLicenceItem from "../model/item/OrbMiningLisenceItem";
import Profile from "../model/Profile";
import ItemPreviewView from "./ItemPreviewView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./WarehouseView.scss";

export interface WarehouseViewProps extends SpaceMinerUICommonProps {
    profile: Profile;
    warehouse: Inventory;
}

export interface WarehouseViewState {
    focusedIndex: Nullable<int>;
}

export default class WarehouseView extends Component<WarehouseViewProps, WarehouseViewState> {

    constructor(props: WarehouseViewProps) {
        super(props);
        this.state = {
            focusedIndex: null,
        };
    }

    override render(): ReactNode {

        const { warehouse, i18n, game, resources } = this.props;
        const { focusedIndex } = this.state;
        const items = warehouse.items;
        const focusedItem = (focusedIndex !== null && items[focusedIndex]) || null;

        return (
            <div className="WarehouseView">
                <h2 className="title">{this.props.i18n.get("ui.warehouse.title")}</h2>

                <div className="content">
                    <div className="items">
                        {items.map((item, index) => (
                            <ItemPreviewView 
                                key={index} 
                                i18n={i18n} 
                                game={game} 
                                item={item}
                                resources={resources}
                                onClick={() => this.setState({ focusedIndex: index })}
                            />
                        ))}
                        {items.length === 0 && (
                            <div className="empty-hint">{this.props.i18n.get("ui.warehouse.empty_hint")}</div>
                        )}
                    </div>
                    {focusedItem && (
                        <div className="detail">
                            <div className="image-wrapper">
                                <img src={focusedItem.getImage(resources)} alt={focusedItem.name.process(i18n)}/>
                                <div className="amount">{displayNumber(focusedItem.amount)}</div>
                            </div>
                            <div className="name">{focusedItem.name.process(i18n)}</div>
                            <div className="description">{focusedItem.description.process(i18n)}</div>
                            <div className="tool-bar">
                                {this.getButtons(focusedItem).map(([name, onClick]) => (<button onClick={onClick as any}>{name}</button>))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    private getButtons(item: Item): Array<Pair<string, Function>> {
        const { game, profile, warehouse } = this.props;
        switch (item.type) {
            case MinerItem.TYPE: return [["部署", () => game.displayMessage(`功能未实现！`)]];
            case OrbMiningLicenceItem.TYPE: return [["宣称", () => {
                game.actions.claimOrb((item as OrbMiningLicenceItem).orb, profile);
                item.amount--;
                warehouse.cleanUp();
                this.forceUpdate();
            }]];
            default: return[];
        }
    }
}

function displayNumber(num: number): string {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}