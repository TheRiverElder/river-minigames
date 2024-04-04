import { Component, ReactNode } from "react";
import { OrbModel } from "../../model/orb/Orb";
import { SpaceMinerGameClientCommonProps } from "../common";
import "./OrbFullPanel.scss";
import { IsolatedFunction, Pair, double, int } from "../../../libs/CommonTypes";
import { int2Color } from "../../../libs/graphics/Graphics";
import I18nText from "../../../libs/i18n/I18nText";
import PlainText from "../../../libs/i18n/PlainText";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import { ItemModel } from "../../model/item/Item";
import Text from "../../../libs/i18n/Text";
import Facility from "../../model/facility/Facility";
import { Nullable } from "../../../libs/lang/Optional";
import SimpleBar from "../common/SimpleBar";
import FacilityDetailView from "../common/model-view/FacilityDetailView";
import AnimatedValue from "../common/AnimatedValue";
import { restoreTextAndProcess } from "../../../libs/i18n/TextRestorer";

export interface OrbFullPanelProps extends SpaceMinerGameClientCommonProps {
    orbUid: int;
}

export interface OrbFullPanelState {
    configuringFacility: Nullable<Facility>;
    orb: Nullable<OrbModel>;
}

export interface FacilityManager {
    // canMove(index: int, offset: int): boolean;
    // move(index: int, offset: int): void;
    // canRemove(index: int): boolean;
    // remove(index: int): void;
}

export default class OrbFullPanel extends Component<OrbFullPanelProps, OrbFullPanelState> implements FacilityManager {

    constructor(props: OrbFullPanelProps) {
        super(props);
        this.state = {
            configuringFacility: null,
            orb: null,
        };
    }

    private readonly disposeFunctions: IsolatedFunction[] = [];

    componentDidMount(): void {
        this.disposeFunctions.push(this.props.gameApi.channelGameUpdate.listeners.UPDATE.add(() => {
            this.props.gameApi.channelGameQuery.requestOrb(this.props.orbUid)
                .then(orb => this.setState({ orb }));
        }));
    }

    componentWillUnmount(): void {
        this.disposeFunctions.forEach(it => it());
    }

    override render(): ReactNode {
        const { i18n, resources, gameApi } = this.props;
        const { orb } = this.state;
        if (!orb) return;

        return (
            <div className="OrbFullPanel">

                <div className="basic-info">
                    <div className="preview">
                        <img style={{ transform: `rotate(${orb.body.rotation}rad)` }} src={resources.get(`orb:${orb.uid}`)} alt={orb.name} />
                    </div>
                    <div className="properties">
                        {this.getProperties(orb).map(([name, value], index) => (
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
                        {this.renderPropertyRow("electricity", orb.supplimentNetwork.battery)}
                        {this.renderPropertyRow("live_support", orb.supplimentNetwork.liveSupport)}
                        {this.renderPropertyRow("shield", orb.supplimentNetwork.strength)}
                        {orb.supplimentNetwork.resources.map((item, index) => this.renderResourceRow(item, index))}
                    </div>
                </div>

                <div className="facilities">
                    <h3 className="title">{i18n.get("ui.orb_full_panel.title.facilities")}</h3>
                    <div className="scroll-view">
                        {orb.facilities.map((facility, index) => (
                            <div className="facility" key={index} >
                                <FacilityDetailView
                                    {...this.props}
                                    facility={facility}
                                    index={index}
                                    manager={this}
                                    onClickOperation={key => gameApi.channelGameAction.sendFacilityAcceptOperation(orb.uid, index, key)}
                                />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }

    getProperties(orb: OrbModel): Array<Pair<Text, Text>> {

        // const estimatedValue = sumBy(orb.getMineralList(),
        //     item => (item instanceof ResourceItem) ? game.shop.pricreOf(item) : 0);

        // const keyOf = (key: string) => `ui.orb_info.property.${key}`;
        const nameTextOf = (key: string) => new I18nText(`ui.orb_info.property.${key}`);
        return [
            [nameTextOf("name"), new PlainText(orb.name)],
            // [nameTextOf("owner"), orb.owner ? new PlainText(orb.owner.name) : new I18nText("ui.orb_info.text.no_owner")],
            [nameTextOf("radius"), new PlainText(orb.body.radius.toFixed(2))],
            [nameTextOf("color"), new PlainText(int2Color(orb.body.color))],
            [nameTextOf("position"), new PlainText(`(${shortenAsHumanReadable(orb.body.position[0])}, ${shortenAsHumanReadable(orb.body.position[1])})`)],
            // [nameTextOf("position"), new PlainText(orb.body.position.toString())],
            [nameTextOf("rotation_angle"), new PlainText(orb.body.rotation.toFixed(2) + "rad")],
            // [nameTextOf("rotation_period"), new PlainText(Math.abs(2 * Math.PI / orb.body.rotationSpeed).toFixed(2) + "t")],
            // [nameTextOf("revolution_period"), new PlainText(Math.abs(2 * Math.PI / orb.body.revolutionSpeed).toFixed(2) + "t")],
            // [nameTextOf("estimated_value"), new PlainText(shortenAsHumanReadable(estimatedValue))],
        ];
    }

    renderPropertyRow(id: string, amount: double) {
        const { i18n, resources } = this.props;
        const name = new I18nText(`resource_type.${id}`).process(i18n);

        const image = resources.get(`item.${id}`);
        const icon = image ? (<img alt={name} src={image} />) : null;
        // const mutationRecords = (!canHarvest && (item instanceof ResourceItem)) ? this.props.orb.supplimentNetwork.getMutationRecordsOf(item.resourceType) : null;

        return (
            <div className="section-content resource with-distribution-bar">
                <span className="name">{name}</span>
                <div className="icon">{icon}</div>
                <SimpleBar
                    color="gray"
                    ratio={mapRatio(amount)}
                    height="0.5em"
                />
                <AnimatedValue
                    duration={500}
                    timingFunction={x => 1 - ((x - 1) * (x - 1))}
                    initialValue={0}
                    value={amount}
                    renderer={(frame, start, end) => (
                        <span className="amount">{shortenAsHumanReadable(start + (end - start) * frame)} U.</span>
                    )}
                />
                <span className="button">
                </span>
            </div>
        );
    }

    renderResourceRow(item: ItemModel, index: int) {
        const { i18n, resources } = this.props;
        const name = restoreTextAndProcess(item.displayedName, i18n);

        const image = resources.get(item.name);
        const icon = image ? (<img alt={name} src={image} />) : null;
        // const mutationRecords = (!canHarvest && (item instanceof ResourceItem)) ? this.props.orb.supplimentNetwork.getMutationRecordsOf(item.resourceType) : null;

        return (
            <div className="section-content resource with-distribution-bar" key={index}>
                <span className="name">{name}</span>
                <div className="icon">{icon}</div>
                {/* <div className="distribution-bar">
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
                </div> */}
                <SimpleBar
                    color="gray"
                    ratio={mapRatio(item.amount)}
                    height="0.5em"
                />
                <AnimatedValue
                    duration={500}
                    timingFunction={x => 1 - ((x - 1) * (x - 1))}
                    initialValue={0}
                    value={item.amount}
                    renderer={(frame, start, end) => (
                        <span className="amount">{shortenAsHumanReadable(start + (end - start) * frame)} U.</span>
                    )}
                />
                <span className="button">
                    <button
                        className="light small"
                    // onClick={() => {
                    //     game.actions.harvestItem(item, orb.supplimentNetwork.resources, game.profile);
                    //     this.forceUpdate();
                    // }}
                    >
                        {i18n.get(`ui.orb_full_panel.button.harvest`)}
                    </button>
                </span>
            </div>
        );
    }

    // canMove(index: number, offset: number): boolean {
    //     const newIndex = index + offset;
    //     return newIndex >= 0 && newIndex < orb.facilities.length;
    // }

    // move(orb: OrbModel, index: number, offset: number): void {
    //     const newIndex = index + offset;
    //     if (!this.canMove(index, offset)) return;
    //     const fs = this.props.orb.facilities.splice(index, 1);
    //     this.props.orb.facilities.splice(newIndex, 0, ...fs);
    // }

    // canRemove(index: number): boolean {
    //     return index >= 0 && index < this.props.orb.facilities.length;
    // }

    // remove(index: number): void {
    //     this.props.orb.facilities.splice(index, 1);
    // }
}

function mapRatio(value: number) {
    let v = 0.1 * (-1 / (Math.log10(value + 1) + 1) + 1);
    return v;
}