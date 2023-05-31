import { Component, ReactNode } from "react";
import Game from "../Game";
import Inventory from "../model/Inventory";
import Item from "../model/item/Item";
import Profile from "../model/Profile";
import "./WarehouseView.scss";

export interface WarehouseViewProps {
    game: Game;
    profile: Profile;
    warehouse: Inventory;
}

export default class WarehouseView extends Component<WarehouseViewProps> {
    override render(): ReactNode {

        const { warehouse } = this.props;
        const items = warehouse.items;

        return (
            <div className="WarehouseView">
                <h2 className="title">总仓库</h2>

                <div className="items">
                    {items.map((item, index) => (
                        <div className="item" key={index}>
                            <div className="image-wrapper">
                                <img src={item.image} alt={item.name}/>
                                <div className="amount">{displayNumber(item.amount)}</div>
                            </div>
                            <div className="name">{item.name}</div>
                            <div className="tool-bar">
                                <button onClick={() => this.onClickButtonUse(item)}>使用</button>
                            </div>
                        </div>
                    ))}
                </div>

                {items.length === 0 && (
                    <div className="empty-hint">
                        总仓库空空如也，快去发掘资源吧！
                    </div>
                )}
            </div>
        );
    }

    private onClickButtonUse(item: Item) {
        const { game, profile, warehouse } = this.props;
        game.useItem(item, warehouse, profile);
        this.forceUpdate();
    }
}

function displayNumber(num: number): string {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}