import { Component, ReactNode } from "react";
import Orb from "../model/orb/Orb";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./OrbFullPanel.scss";
import { Pair, int } from "../../libs/CommonTypes";
import { int2Color } from "../../libs/graphics/Graphics";
import I18nText from "../../libs/i18n/I18nText";
import PlainText from "../../libs/i18n/PlainText";
import { shortenAsHumanReadable } from "../../libs/lang/Extensions";
import Item from "../model/item/Item";
import ResourceItem from "../model/item/ResourceItem";
import { ResourceTypes } from "../model/ResourceTypes";
import DistributionBar from "./common/DistributionBar";
import { FacilityInfoView } from "./FacilityInfoView";
import SectionView from "./SectionView";
import Text from "../../libs/i18n/Text";

export interface OrbFullPanelProps extends SpaceMinerUICommonProps {
    orb: Orb;
}

export interface OrbFullPanelState {

}

export default class OrbFullPanel extends Component<OrbFullPanelProps, OrbFullPanelState> {

    override componentDidMount(): void {
        const game = this.props.game;
        game.listeners.UI_UPDATE.add(this.onTick);
    }

    override componentWillUnmount(): void {
        const game = this.props.game;
        game.listeners.UI_UPDATE.remove(this.onTick);
    }

    onTick = () => {
        this.forceUpdate();
    };

    override render(): ReactNode {
        const { orb, game, i18n, resources, client } = this.props;

        return (
            <div className="OrbFullPanel">

                <div className="preview">
                    <img style={{ transform: `rotate(${orb.body.rotation}rad)` }} src={resources.get(`orb:${orb.uid}`)} alt={orb.name} />
                </div>

                <SectionView title={i18n.get("ui.orb_info.title.properties")}>
                    <div className="properties">
                        {this.getProperties().map(([name, value], index) => (
                            <div className="section-content property" key={index}>
                                <span className="name">{name.process(i18n)}</span>
                                <span className="value">{value.process(i18n)}</span>
                            </div>
                        ))}
                    </div>
                </SectionView>

                <SectionView title={i18n.get("ui.orb_info.title.resources", { "kind_amount": orb.supplimentNetwork.resources.content.length })}>
                    <div className="resources">
                        {this.renderDistributionBarRow(new ResourceItem(ResourceTypes.ELECTRUCITY, orb.supplimentNetwork.battery), -2)}
                        {this.renderDistributionBarRow(new ResourceItem(ResourceTypes.LIVE_SUPPORT, orb.supplimentNetwork.liveSupport), -1)}
                        {orb.supplimentNetwork.resources.content.map((item, index) => this.renderResourceRow(item, index))}
                    </div>
                </SectionView>

                <SectionView title={i18n.get("ui.orb_info.title.facilities", { "facility_amount": orb.facilities.length })}>
                    <div className="facilities">
                        {orb.facilities.map((facility, index) => (
                            <div className="facility" key={index}>
                                <FacilityInfoView facility={facility} {...this.props} readonly />
                            </div>
                        ))}
                    </div>
                </SectionView>
            </div>
        );
    }

    getProperties(): Array<Pair<Text, Text>> {
        const orb = this.props.orb;
        const game = this.props.game;

        // const estimatedValue = sumBy(orb.getMineralList(),
        //     item => (item instanceof ResourceItem) ? game.shop.pricreOf(item) : 0);

        // const keyOf = (key: string) => `ui.orb_info.property.${key}`;
        const nameTextOf = (key: string) => new I18nText(`ui.orb_info.property.${key}`);
        return [
            [nameTextOf("name"), new PlainText(orb.name)],
            [nameTextOf("owner"), orb.owner ? new PlainText(orb.owner.name) : new I18nText("ui.orb_info.text.no_owner")],
            [nameTextOf("radius"), new PlainText(orb.body.radius.toFixed(2))],
            [nameTextOf("color"), new PlainText(int2Color(orb.body.color))],
            [nameTextOf("position"), new PlainText(`(${shortenAsHumanReadable(orb.body.position.x)}, ${shortenAsHumanReadable(orb.body.position.y)})`)],
            // [nameTextOf("position"), new PlainText(orb.body.position.toString())],
            [nameTextOf("rotation_angle"), new PlainText(orb.body.rotation.toFixed(2) + "rad")],
            [nameTextOf("rotation_period"), new PlainText(Math.abs(2 * Math.PI / orb.body.rotationSpeed).toFixed(2) + "t")],
            [nameTextOf("revolution_period"), new PlainText(Math.abs(2 * Math.PI / orb.body.revolutionSpeed).toFixed(2) + "t")],
            // [nameTextOf("estimated_value"), new PlainText(shortenAsHumanReadable(estimatedValue))],
        ];
    }

    renderDistributionBarRow(item: ResourceItem, index: int) {
        const i18n = this.props.i18n;
        const resources = this.props.resources;
        const name = item.displayedName.process(i18n);

        const image = resources.get(item.name);
        const icon = image ? (<img alt={name} src={image} />) : null;

        return (
            <div className="section-content resource with-distribution-bar" key={index}>
                <span className="name">{name}</span>
                <div className="icon">{icon}</div>
                <div className="distribution-bar">
                    <DistributionBar
                        {...this.props}
                        parts={this.props.orb.supplimentNetwork.getMutationRecordsOf(item.resourceType).map(([facility, delta]) => [delta])}
                    />
                </div>
                <span className="amount">{shortenAsHumanReadable(item.amount)} U.</span>
            </div>
        );
    }

    renderResourceRow(item: Item, index: int) {
        const i18n = this.props.i18n;
        const resources = this.props.resources;
        const name = item.displayedName.process(i18n);

        const image = resources.get(item.name);
        const icon = image ? (<img alt={name} src={image} />) : null;

        return (
            <div className="section-content resource" key={index}>
                <span className="name">{name}</span>
                <div className="icon">{icon}</div>
                <span className="amount">{shortenAsHumanReadable(item.amount)} U.</span>
            </div>
        );
    }
}