import { Component, ReactNode } from "react";
import Item from "../model/item/Item";
import "./ItemInfoView.scss";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";


export interface ItemInfoViewProps extends SpaceMinerUICommonProps {
    item: Item;
    tools?: ReactNode;
}

export default class ItemInfoView extends Component<ItemInfoViewProps> {

    override render(): ReactNode {
        const { item, i18n, tools } = this.props;

        const name = item.name.process(i18n);
        const description = item.description.process(i18n);

        return (
            <div className="ItemInfoView">
                <div className="image-wrapper">
                    <img src={item.image} alt={name}/>
                </div>
                <div className="detail">
                    <div className="name">{name}</div>
                    <div className="description">{description}</div>
                </div>
                <div className="tools-wrapper">{tools}</div>
            </div>
        );
    }
}