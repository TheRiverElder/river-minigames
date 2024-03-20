import { MouseEventHandler, ReactNode } from "react";
import { shortenAsHumanReadable } from "../../../../libs/lang/Extensions";
import { ItemModel } from "../../../model/item/Item";
import SpaceMinerGameClientCommonProps from "../../common";
import SimpleInfoCardView from "../SimpleInfoCardView";
import "./ItemInfoView.scss";
import { restoreTextAndProcess } from "../../../../libs/i18n/TextRestorer";


export interface ItemInfoViewProps extends SpaceMinerGameClientCommonProps {
    item: ItemModel;
    tools?: ReactNode;
    onClick?: MouseEventHandler<HTMLDivElement> | undefined;
}

export default function ItemInfoView(props: ItemInfoViewProps): JSX.Element {
    const { item, i18n, resources, tools, onClick } = props;
    const image = resources.get(item.name);
    const icon = image ? (<img alt={item.name} src={image} />) : null;

    return (
        <SimpleInfoCardView
            icon={icon}
            name={(
                <div className="title">
                    <span className="name">{restoreTextAndProcess(item.displayedName, i18n)}</span>
                    <span className="amount"> × {shortenAsHumanReadable(item.amount)}</span>
                </div>
            )}
            description={(<p>{restoreTextAndProcess(item.description, i18n)}</p>)}
            tools={tools}
            onClick={onClick}
        />
    );
}