import { Component, ReactNode } from "react";
import { int, Pair } from "../../libs/CommonTypes";
import I18nText from "../../libs/i18n/I18nText";
import Text from "../../libs/i18n/Text";
import { Nullable } from "../../libs/lang/Optional";
import Item from "../model/item/Item";
import Inventory from "../model/misc/storage/Inventory";
import Profile from "../model/Profile";
import NumberInputDialog from "./common/NumberInputDialog";
import ItemPreviewView from "./ItemPreviewView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./WarehouseView.scss";

export interface WarehouseViewProps extends SpaceMinerUICommonProps {
    profile: Profile;
    inventory: Inventory;
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

        const { inventory: warehouse, i18n, game, client, resources } = this.props;
        const { focusedIndex } = this.state;
        const items = warehouse.content;
        const focusedItem = (focusedIndex !== null && items[focusedIndex]) || null;

        return (
            <div className="WarehouseView">
                <div className="content">
                    <div className="items">
                        {items.map((item, index) => (
                            <ItemPreviewView 
                                key={index} 
                                i18n={i18n} 
                                game={game} 
                                client={client}
                                item={item}
                                resources={resources}
                                onClick={() => this.setState({ focusedIndex: index })}
                            />
                        ))}
                        {items.length === 0 && (
                            <div className="empty-hint">{this.props.i18n.get("ui.warehouse.text.empty_hint")}</div>
                        )}
                    </div>
                    {focusedItem && (
                        <div className="detail">
                            <div className="image-wrapper">
                                <img src={focusedItem.getImage(resources)} alt={focusedItem.displayedName.process(i18n)}/>
                                <div className="amount">{displayNumber(focusedItem.amount)}</div>
                            </div>
                            <div className="name">{focusedItem.displayedName.process(i18n)}</div>
                            <div className="description">{focusedItem.description.process(i18n)}</div>
                            <div className="tool-bar">
                                {this.getButtons(focusedItem).map(([text, onClick]) => (<button onClick={onClick as any}>{text.process(i18n)}</button>))}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        );
    }

    private getButtons(item: Item): Array<Pair<Text, Function>> {
        const { game, profile, inventory } = this.props;
        const result: Array<Pair<Text, Function>> = [
            [new I18nText(`ui.warehouse.button.use`), () => {
                if (item.amount === 1) {
                    game.actions.useItem(item, inventory, profile);
                    return;
                }
                this.props.client.openDialog({
                    initialValue: item.amount,
                    renderContent: (p) => NumberInputDialog({
                        min: 0,
                        max: item.amount,
                        step: 1,
                        value: p.value,
                        onChange: p.onChange,
                    }),
                }).then(amount => {
                    if (amount <= 0) return;
                    game.actions.useItem(item.take(amount), inventory, profile);
                    this.forceUpdate();
                });
            }],
        ];
        if (inventory !== profile.warehouse) {
            result.push([new I18nText(`ui.warehouse.button.collect`), () => {
                game.actions.harvestItem(item, inventory, profile);
                this.forceUpdate();
            }]);
        }
        return result;
    }
}

function displayNumber(num: number): string {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}