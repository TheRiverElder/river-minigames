import { Component, createRef, ReactNode } from "react";
import { Pair } from "../../libs/CommonTypes";
import { int2Color } from "../../libs/graphics/Graphics";
import I18nText from "../../libs/i18n/I18nText";
import PlainText from "../../libs/i18n/PlainText";
import Text from "../../libs/i18n/Text";
import { sumBy } from "../../libs/lang/Collections";
import ResourceItem from "../model/item/ResourceItem";
import Orb from "../model/orb/Orb";
import OrbView from "./OrbView";
import SpaceMinerUICommonProps from "./SpaceMinerUICommonProps";
import "./OrbInfoView.scss";
import SectionView from "./SectionView";
import { readableNumber, shortenAsHumanReadable } from "../../libs/lang/Extensions";
import { drawOrbBody } from "./OrbGraphics";

export interface OrbInfoViewProps extends SpaceMinerUICommonProps {
    orb: Orb;
    previewMode?: boolean;
}

export default class OrbInfoView extends Component<OrbInfoViewProps> {

    private readonly refCanvas = createRef<HTMLCanvasElement>();

    get isPreviewMode(): boolean {
        return typeof this.props.previewMode === "boolean" ? this.props.previewMode : false;
    }

    override render(): ReactNode {
        const orb = this.props.orb;
        const i18n = this.props.i18n;
        const game = this.props.game;

        return (
            <div className="OrbInfoView">

                <div className="preview">
                    <canvas ref={this.refCanvas}/>
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

                <SectionView title={i18n.get("ui.orb_info.title.resources")}>
                    <div className="resources">
                        {orb.mines.items.map((item, index) => (
                            <div className="section-content resource" key={index}>
                                <span className="name">{item.name.process(i18n)}</span>
                                <span className="amount">{shortenAsHumanReadable(item.amount)} U.</span>
                            </div>
                        ))}
                    </div>
                </SectionView>

                <SectionView title={i18n.get("ui.orb_info.title.miners")}>
                    <div className="miners">
                        {Array.from(orb.miners).map((miner, index) => (
                            <div className="section-content miner" key={index}>
                                <span className="name">{miner.name}</span>
                                <span className="depth">@{shortenAsHumanReadable(miner.location?.depth || 0)}</span>
                                <button
                                    disabled={this.isPreviewMode}
                                    onClick={() => game.actions.recallMiner(miner, game.profile)}
                                >{i18n.get("ui.orb_info.button.recall")}</button>
                                <button
                                    disabled={this.isPreviewMode}
                                    onClick={() => game.actions.restartMiner(miner, game.profile)}
                                >{i18n.get("ui.orb_info.button.restart")}</button>
                            </div>
                        ))}
                    </div>
                </SectionView>
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
            [nameTextOf("owner"), orb.owner ? new PlainText(orb.owner.name) : new I18nText("ui.orb_info.text.no_owner")],
            [nameTextOf("radius"), new PlainText(orb.radius.toFixed(2))],
            [nameTextOf("color"), new PlainText(int2Color(orb.color))],
            [nameTextOf("position"), new PlainText(orb.position.toString())],
            [nameTextOf("rotation_angle"), new PlainText(orb.rotation.toFixed(2) + "rad")],
            [nameTextOf("rotation_period"), new PlainText(Math.abs(2 * Math.PI / orb.rotationSpeed).toFixed(2) + "t")],
            [nameTextOf("revolution_period"), new PlainText(Math.abs(2 * Math.PI / orb.revolutionSpeed).toFixed(2) + "t")],
            [nameTextOf("estimated_value"), new PlainText(shortenAsHumanReadable(estimatedValue))],
        ];
    }

    onUpdate = () => {
        this.forceUpdate();
    };

    override componentDidMount(): void {
        this.props.game.onTickListener.add(this.onUpdate);
        this.redrawPreview();
    }

    override componentWillUnmount(): void {
        this.props.game.onTickListener.remove(this.onUpdate);
    }

    override componentDidUpdate(prevProps: Readonly<OrbInfoViewProps>, prevState: Readonly<{}>, snapshot?: any): void {
        if (prevProps.orb.uid !== this.props.orb.uid) this.redrawPreview();
    }

    redrawPreview() {
        const canvas = this.refCanvas.current;
        if (!canvas) return;
        const g = canvas.getContext("2d");
        if (!g) return;
        
        const rect = canvas.getBoundingClientRect();
        canvas.width = Math.floor(rect.width);
        canvas.height = Math.floor(rect.height);

        g.save();

        drawOrbBody(this.props.orb, g);

        g.restore();
    }
    
}