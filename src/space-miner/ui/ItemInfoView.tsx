import { Component, ReactNode } from "react";
import { shortenAsHumanReadable } from "../../libs/lang/Extensions";
import Item from "../model/item/Item";
import "./ItemInfoView.scss";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";


export interface ItemInfoViewProps extends SpaceMinerUICommonProps {
    item: Item;
    tools?: ReactNode;
}

export default class ItemInfoView extends Component<ItemInfoViewProps> {

    override render(): ReactNode {
        const { item, i18n, resources, tools } = this.props;

        const name = item.displayedName.process(i18n);
        const description = item.description.process(i18n);
        const amount = shortenAsHumanReadable(item.amount);

        return (
            <div className="ItemInfoView">
                <div className="image-wrapper">
                    <img src={item.getImage(resources)} alt={name}/>
                </div>
                <div className="detail">
                    <div className="title">
                        <span className="name">{name}</span>
                        <span className="amount">× {amount}</span>
                    </div>
                    <div className="description">{description}</div>
                </div>
                <div className="tools-wrapper">{tools}</div>
            </div>
        );
    }
}