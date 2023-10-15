import { Component, ReactNode } from "react";
import Item from "../model/item/Item";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./ItemPreviewView.scss";
import { Consumer } from "../../libs/CommonTypes";
import { ifNotNull } from "../../libs/lang/Objects";
import { shortenAsHumanReadable } from "../../libs/lang/Extensions";

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
    return shortenAsHumanReadable(num, Number.isInteger(num) ? 0 : 1);
}