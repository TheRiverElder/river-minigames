import { MouseEventHandler, ReactNode } from "react";
import { shortenAsHumanReadable } from "../../../../libs/lang/Extensions";
import Item from "../../../model/item/Item";
import SpaceMinerGameClientCommonProps from "../../common";
import SimpleInfoCardView from "../SimpleInfoCardView";
import "./ItemInfoView.scss";


export interface ItemInfoViewProps extends SpaceMinerGameClientCommonProps {
    item: Item;
    tools?: ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}

export default function ItemInfoView(props: ItemInfoViewProps): JSX.Element {
    const { item, i18n, resources, tools, onClick } = props;
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
            onClick={onClick}
        />
    );
}