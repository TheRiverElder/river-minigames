import { Component, ReactNode } from "react";
import Item from "../model/item/Item";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./ItemPreviewView.scss";
import { Consumer } from "../../libs/CommonTypes";
import { ifNotNull } from "../../libs/lang/Objects";

export interface ItemPreviewViewProps extends SpaceMinerUICommonProps {
    item: Item;
    onClick?: Consumer<Item>;
}

export default class ItemPreviewView extends Component<ItemPreviewViewProps> {
    override render(): ReactNode {
        const { i18n, item, resources, onClick } = this.props;
        return (
            <div className="ItemPreviewView" onClick={() => ifNotNull<Consumer<Item>>(onClick, on => on(item))}>
                <div className="image-wrapper">
                    <img src={item.getImage(resources)} alt={item.displayedName.process(i18n)}/>
                    <div className="amount">{displayNumber(item.amount)}</div>
                </div>
                <div className="name">{item.displayedName.process(i18n)}</div>
            </div>
        );
    }
}

function displayNumber(num: number): string {
    return Number.isInteger(num) ? num.toString() : num.toFixed(2);
}