import { Component, ReactNode } from "react";
import { Pair } from "../../libs/CommonTypes";
import { int2Color } from "../../libs/graphics/Graphics";
import I18nText from "../../libs/i18n/I18nText";
import PlainText from "../../libs/i18n/PlainText";
import Text from "../../libs/i18n/Text";
import { sumBy } from "../../libs/lang/Collections";
import ResourceItem from "../model/item/ResourceItem";
import Orb from "../model/Orb";
import OrbView from "./OrbView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./OrbInfoView.scss";

export interface OrbInfoViewProps extends SpaceMinerUICommonProps {
    orb: Orb;
}

export default class OrbInfoView extends Component<OrbInfoViewProps> {

    override render(): ReactNode {
        const orb = this.props.orb;
        const i18n = this.props.i18n;
        const game = this.props.game;

        return (
            <div className="OrbInfoView">

                <div className="preview">
                    <div className="wrapper">
                        <OrbView key={orb.uid} orb={orb} i18n={i18n} game={game} doAdjustPosition={false} />
                    </div>
                </div>

                <div className="title">{i18n.get("ui.orb_info.title.properties")}</div>
                
                <div className="properties">
                    {this.getProperties().map(([name, value], index) => (
                        <div className="property" key={index}>
                            <span className="name">{name.process(i18n)}</span>
                            <span className="value">{value.process(i18n)}</span>
                        </div>
                    ))}
                </div>

                <div className="title">{i18n.get("ui.orb_info.title.resources")}</div>

                <div className="resources">
                    {orb.mines.items.map((item, index) => (
                        <div className="resource" key={index}>
                            <span className="name">{item.name.process(i18n)}</span>
                            <span className="amount">{item.amount} U.</span>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    getProperties(): Array<Pair<Text, Text>> {
        const orb = this.props.orb;

        const estimatedValue = sumBy(orb.mines.items, 
            item => (item instanceof ResourceItem) ? (item.amount * item.resourceType.basicValue) : 0);

        // const keyOf = (key: string) => `ui.orb_info.property.${key}`;
        const nameTextOf = (key: string) => new I18nText(`ui.orb_info.property.${key}`);
        return [
            [nameTextOf("name"), new PlainText(orb.name)],
            [nameTextOf("radius"), new PlainText(orb.radius.toFixed(2))],
            [nameTextOf("color"), new PlainText(int2Color(orb.color))],
            [nameTextOf("position"), new PlainText(orb.position.toString())],
            [nameTextOf("rotation_angle"), new PlainText(orb.forward.toFixed(2) + "rad")],
            [nameTextOf("rotation_period"), new PlainText((2 * Math.PI / orb.rotationSpeed).toFixed(2) + "t")],
            [nameTextOf("revolution_period"), new PlainText((2 * Math.PI / orb.revolutionSpeed).toFixed(2) + "t")],
            [nameTextOf("estimated_value"), new PlainText(estimatedValue.toFixed(2))],
        ];
    }
    
}