import { Component, ReactNode } from "react";
import Orb from "../model/orb/Orb";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./OrbFullPanel.scss";
import { Pair, int, double } from "../../libs/CommonTypes";
import { int2Color } from "../../libs/graphics/Graphics";
import I18nText from "../../libs/i18n/I18nText";
import PlainText from "../../libs/i18n/PlainText";
import { shortenAsHumanReadable } from "../../libs/lang/Extensions";
import Item from "../model/item/Item";
import ResourceItem from "../model/item/ResourceItem";
import { ResourceTypes } from "../model/misc/ResourceTypes";
import DistributionBar from "./common/DistributionBar";
import Text from "../../libs/i18n/Text";
import Facility from "../model/facility/Facility";
import { Nullable } from "../../libs/lang/Optional";
import FacilityDetailView from "./FacilityDetailView";
import SimpleBar from "./common/SimpleBar";

export interface OrbFullPanelProps extends SpaceMinerUICommonProps {
    orb: Orb;
}

export interface OrbFullPanelState {
    configuringFacility: Nullable<Facility>;
}

export interface FacilityManager {
    canMove(index: int, offset: int): boolean;
    move(index: int, offset: int): void;
    canRemove(index: int): boolean;
    remove(index: int): void;
}

export default class OrbFullPanel extends Component<OrbFullPanelProps, OrbFullPanelState> implements FacilityManager {

    constructor(props: OrbFullPanelProps) {
        super(props);
        this.state = {
            configuringFacility: null,
        };
    }

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
        const { orb, i18n, resources, game } = this.props;

        return (
            <div className="OrbFullPanel">

                <div className="basic-info">
                    <div className="preview">
                        <img style={{ transform: `rotate(${orb.body.rotation}rad)` }} src={resources.get(`orb:${orb.uid}`)} alt={orb.name} />
                    </div>
                    <div className="properties">
                        {this.getProperties().map(([name, value], index) => (
                            <div className="section-content property" key={index}>
                                <span className="name">{name.process(i18n)}</span>
                                <span className="value">{value.process(i18n)}</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="resources">
                    <h3 className="title">{i18n.get("ui.orb_full_panel.title.resources")}</h3>
                    <div className="scroll-view">
                        {this.renderResourceRow(new ResourceItem(game, ResourceTypes.ELECTRICITY, orb.supplimentNetwork.battery), -1, false)}
                        {this.renderResourceRow(new ResourceItem(game, ResourceTypes.LIVE_SUPPORT, orb.supplimentNetwork.liveSupport), -2, false)}
                        {this.renderResourceRow(new ResourceItem(game, ResourceTypes.SHIELD, orb.supplimentNetwork.strength), -3, false)}
                        {orb.supplimentNetwork.resources.content.map((item, index) => this.renderResourceRow(item, index))}
                    </div>
                </div>

                <div className="facilities">
                    <h3 className="title">{i18n.get("ui.orb_full_panel.title.facilities")}</h3>
                    <div className="scroll-view">
                        {orb.facilities.map((facility, index) => (
                            <div className="facility" key={index} onClick={() => this.setState({ configuringFacility: facility })}>
                                <FacilityDetailView facility={facility} {...this.props} index={index} manager={this} />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    getProperties(): Array<Pair<Text, Text>> {
        const orb = this.props.orb;

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

    renderResourceRow(item: Item, index: int, canHarvest: boolean = true) {
        const { i18n, game, orb, resources } = this.props;
        const name = item.displayedName.process(i18n);

        const image = resources.get(item.name);
        const icon = image ? (<img alt={name} src={image} />) : null;
        const mutationRecords = (!canHarvest && (item instanceof ResourceItem)) ? this.props.orb.supplimentNetwork.getMutationRecordsOf(item.resourceType) : null;

        return (
            <div className="section-content resource with-distribution-bar" key={index}>
                <span className="name">{name}</span>
                <div className="icon">{icon}</div>
                <div className="distribution-bar">
                    {mutationRecords ? (<DistributionBar
                        {...this.props}
                        parts={mutationRecords.map(([, delta]) => [delta])}
                    />) : (
                        <SimpleBar
                            color="gray"
                            ratio={mapRatio(item.amount)}
                            height="0.5em"
                        />
                    )}
                </div>
                <span className="amount">{shortenAsHumanReadable(item.amount)} U.</span>
                <span className="button">
                    {canHarvest && (
                        <button
                            className="light small"
                            onClick={() => {
                                game.actions.harvestItem(item, orb.supplimentNetwork.resources, game.profile);
                                this.forceUpdate();
                            }}
                        >
                            {i18n.get(`ui.orb_full_panel.button.harvest`)}
                        </button>
                    )}
                </span>
            </div>
        );
    }

    canMove(index: number, offset: number): boolean {
        const newIndex = index + offset;
        return newIndex >= 0 && newIndex < this.props.orb.facilities.length;
    }

    move(index: number, offset: number): void {
        const newIndex = index + offset;
        if (!this.canMove(index, offset)) return;
        const fs = this.props.orb.facilities.splice(index, 1);
        this.props.orb.facilities.splice(newIndex, 0, ...fs);
    }

    canRemove(index: number): boolean {
        return index >= 0 && index < this.props.orb.facilities.length;
    }

    remove(index: number): void {
        this.props.orb.facilities.splice(index, 1);
    }
}

function mapRatio(value: number) {
    let v = 0.1 * (-1 / (Math.log10(value + 1) + 1) + 1);
    return v;
}