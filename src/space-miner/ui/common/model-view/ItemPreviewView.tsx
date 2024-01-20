import { Component, ReactNode } from "react";
import { Consumer } from "../../../../libs/CommonTypes";
import { shortenAsHumanReadable } from "../../../../libs/lang/Extensions";
import { ifNotNull } from "../../../../libs/lang/Objects";
import Item from "../../../model/item/Item";
import SpaceMinerGameClientCommonProps from "../../common";
import "./ItemPreviewView.scss";

export interface ItemPreviewViewProps extends SpaceMinerGameClientCommonProps {
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