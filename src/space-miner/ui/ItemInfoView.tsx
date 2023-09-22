import { Component, ReactNode } from "react";
import { shortenAsHumanReadable } from "../../libs/lang/Extensions";
import Item from "../model/item/Item";
import "./ItemInfoView.scss";
import SimpleInfoCardView from "./SimpleInfoCardView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";


export interface ItemInfoViewProps extends SpaceMinerUICommonProps {
    item: Item;
    tools?: ReactNode;
}

// export default class ItemInfoView extends Component<ItemInfoViewProps> {

//     override render(): ReactNode {
//         const { item, i18n, resources, tools } = this.props;

//         const name = item.displayedName.process(i18n);
//         const description = item.description.process(i18n);
//         const amount = shortenAsHumanReadable(item.amount);

//         return (
//             <div className="ItemInfoView">
//                 <div className="image-wrapper">
//                     <img src={item.getImage(resources)} alt={name}/>
//                 </div>
//                 <div className="detail">
//                     <div className="title">
//                         <span className="name">{name}</span>
//                         <span className="amount">× {amount}</span>
//                     </div>
//                     <div className="description">{description}</div>
//                 </div>
//                 <div className="tools-wrapper">{tools}</div>
//             </div>
//         );
//     }
// }

export default function ItemInfoView(props: ItemInfoViewProps): JSX.Element {
    const { item, i18n, resources, tools } = props;
    return (
        <SimpleInfoCardView
            icon={(<img src={item.getImage(resources)} alt={item.displayedName.process(i18n)}/>)}
            name={(
                <div className="title">
                    <span className="name">{item.displayedName.process(i18n)}</span>
                    <span className="amount"> × {shortenAsHumanReadable(item.amount)}</span>
                </div>
            )}
            description={(<p>{item.description.process(i18n)}</p>)}
            tools={tools}
        />
    );
}