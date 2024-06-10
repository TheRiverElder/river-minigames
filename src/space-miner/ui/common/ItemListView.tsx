import { ItemModel } from "../../model/item/Item";
import { SpaceMinerGameClientCommonProps, purifyGameCommonProps } from "../common";
import ItemInfoView from "./model-view/ItemInfoView";


export interface ItemListViewProps extends SpaceMinerGameClientCommonProps {
    itemList: Array<ItemModel>
}

export default function ItemListView(props: ItemListViewProps) {
    const commonProps = purifyGameCommonProps(props);
    return (
        <div className="ItemListView">
            {props.itemList.map((item, index) => (
                <div key={index} className="item" >
                    <ItemInfoView {...commonProps} item={item} />
                </div>
            ))}
        </div>
    );
}