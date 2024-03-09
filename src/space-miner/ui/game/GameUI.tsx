import { Component, createRef, CSSProperties, ReactNode } from "react";
import { double } from "../../../libs/CommonTypes";
import I18n from "../../../libs/i18n/I18n";
import I18nText from "../../../libs/i18n/I18nText";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import Orb from "../../model/orb/Orb";
import ConsoleView from "./ConsoleView";
import { drawBackground } from "../graphics/BackgroundGraphics";
import { drawResourceTexture } from "../graphics/OrbGraphics";
import OrbInfoView from "../OrbInfoView";
import "./GameUI.scss";
import SpaceMinerGameClientCommonProps, { SpaceMinerClientTab, SpaceMinerGameRuleController, SpaceMinerUIController } from "../common";
import SpaceMinerGameTopBar from "./SpaceMinerGameTopBar";
import ShopView from "../tab/ShopView";
import WarehouseView from "../tab/WarehouseView";
import AssemblerView from "../tab/AssemblerView";
import DeploymentView from "../tab/DeploymentView";
import DevelopmentCenterView from "../tab/DevelopmentCenterView";
import MessageNotifier from "../frame/MessageNotifier";
import WorldView from "./WorldView";
import { openLevelEndDialog } from "../Utils";

export interface GameUIProps {
    i18n: I18n;
    game: Game;
    uiController: SpaceMinerUIController;
}

// type OverlayType = "shop" | "warehouse" | "assembler" | "deployment" | "development_center";
type OverlayType = "shop" | "warehouse" | "deployment" | "development_center";
const OVERLAY_TYPES: Array<OverlayType> = ["shop", "warehouse", "deployment", "development_center"];

export interface GameUIState {
    orbs: Array<Orb>;
    // offset: Vector2;
    detailedOrb: Nullable<Orb>;
    consoleShown: boolean;
    timeSpeed: double;
    hasShownLevelCompleted: boolean;
}

export default class GameUI extends Component<GameUIProps, GameUIState> implements SpaceMinerGameRuleController {

    get game(): Game { return this.props.game; }
    get i18n(): I18n { return this.props.i18n; }
    resources = new Map<string, string>();

    constructor(props: GameUIProps) {
        super(props);
        this.state = {
            orbs: Array.from(this.game.profile.ownedOrbs),
            // offset: Vector2.ZERO,
            detailedOrb: null,
            consoleShown: false,
            timeSpeed: 20,
            hasShownLevelCompleted: false,
        };
    }

    private refSpace = createRef<HTMLDivElement>();
    private refBackground = createRef<HTMLCanvasElement>();

    makeCommonProps(): SpaceMinerGameClientCommonProps {
        return {
            i18n: this.props.i18n,
            game: this.props.game,
            resources: this.resources,
            uiController: this.props.uiController,
            gameRuleController: this,
        };
    }

    override render(): ReactNode {

        const game = this.game;
        const i18n = this.i18n;
        const profile = game.profile;
        const detailedOrb = this.state.detailedOrb;

        const mapStyle: CSSProperties = {
            // ...this.state.offset.toPositionCss(),
        };

        const commonProps: SpaceMinerGameClientCommonProps = this.makeCommonProps();

        return (
            <div className="GameUI">
                <canvas className="background" ref={this.refBackground} />
                <div ref={this.refSpace} className="space" style={mapStyle}>
                    <WorldView world={game.world} profile={profile} {...commonProps} onClickOrb={this.onClickOrb} />
                </div>

                <SpaceMinerGameTopBar {...commonProps} />

                {detailedOrb && (
                    <div className="orb-info">
                        <OrbInfoView orb={detailedOrb} {...commonProps} />
                        <div className="close-button" onClick={() => this.setState({ detailedOrb: null })}>X</div>
                    </div>
                )}
                {/* {overlayType && (<Overlay onBack={() => this.setState({ overlayType: null })}>{this.renderOverlay(overlayType)}</Overlay>)} */}

                <div className="bottom-bar">
                    {OVERLAY_TYPES.map(t => (
                        <button
                            key={t}
                            onClick={() => this.props.uiController.openTab(this.createTab(t))}
                        >{i18n.get(`ui.game.bottom_bar.button.${t}`)}</button>
                    ))}
                </div>

                <MessageNotifier className="messages" i18n={i18n} listeners={game.listeners.MESSAGE} />

                {this.state.consoleShown && (
                    <div className="console">
                        <div>
                            <button onClick={() => this.setState({ consoleShown: false })}>Close</button>
                        </div>
                        <ConsoleView {...commonProps} />
                    </div>
                )}

                {/* <div style={{width: "100%", height: "100%", position: "absolute", top: "0", left: "0", pointerEvents: "none"}} onClick={() => window.alert("test-overlay")}/> */}
            </div>
        );
    }

    // 没办法，兄弟节点中只有一个可以被触发，只能用这种方式触发下层的space层
    // onClickHud = (mouseEvent: MouseEvent) => {
    //     const space = this.refSpace.current;
    //     if (!space) return;
    //     const originEvent = mouseEvent.nativeEvent;
    //     const event = document.createEvent("MouseEvent");
    //     event.initMouseEvent(
    //         "click",
    //         originEvent.bubbles,
    //         originEvent.cancelable,
    //         window,
    //         originEvent.detail,
    //         originEvent.screenX, originEvent.screenY,
    //         originEvent.clientX, originEvent.clientY,
    //         originEvent.ctrlKey,
    //         originEvent.altKey,
    //         originEvent.shiftKey,
    //         originEvent.metaKey,
    //         originEvent.button,
    //         space,
    //     )
    //     // Object.entries(Object.getOwnPropertyDescriptors(event)).forEach(([key, descriptor]) => {
    //     //     console.log(key);
    //     //     if (!descriptor.writable || !descriptor.set) return;
    //     //     (event as any)[key] = (originEvent as any)[key];
    //     // });
    //     space.dispatchEvent(event);
    // };

    onClickOrb = (orb: Orb) => {
        // 由于目前还没考虑做删除星球的逻辑，故先不用考虑吧如果星球被删除后这个细节面板还保留的问题
        this.setState({ detailedOrb: orb });
    };

    createTab(type: OverlayType): SpaceMinerClientTab {
        const game = this.game;

        const commonProps: SpaceMinerGameClientCommonProps = {
            i18n: this.props.i18n,
            game,
            resources: this.resources,
            uiController: this.props.uiController,
            gameRuleController: this,
        };

        const title = new I18nText(`ui.${type}.text.title`);

        switch (type) {
            case "shop": return { title, content: (<ShopView {...commonProps} shop={game.shop} />) };
            case "warehouse": return { title, content: (<WarehouseView {...commonProps} profile={game.profile} inventory={game.profile.warehouse} />) };
            // case "assembler": return { title, content: (<AssemblerView {...commonProps} profile={game.profile} />) };
            case "deployment": return { title, content: (<DeploymentView {...commonProps} />) };
            case "development_center": return { title, content: (<DevelopmentCenterView {...commonProps} profile={game.profile} technologies={Array.from(game.technologies)} />) };
        }
    }


    private pid: Nullable<NodeJS.Timeout> = null;
    private mounted: boolean = false;

    override componentDidMount(): void {
        window.addEventListener("keydown", this.keyDown);
        this.prepareTextures();
        this.mounted = true;
        this.redrawBackground();
        // this.setState({ offset: new Vector2(window.innerWidth / 2, window.innerHeight / 2) });
        const loop = () => {
            if (!this.mounted) return;
            if (this.state.timeSpeed > 0) {
                this.game.tick();
                if (this.game.level.completed && !this.state.hasShownLevelCompleted) {
                    openLevelEndDialog(this.makeCommonProps());
                    this.setState({ hasShownLevelCompleted: true });
                    this.setTimeSpeed(0);
                }
            }
            const period = 1000 / this.getTimeSpeed();
            if (period <= 0 || !Number.isFinite(period)) {
                this.pid = setTimeout(loop, 1 / 20);
            } else {
                this.pid = setTimeout(loop, period);
            }
        };
        loop();
    }

    override componentWillUnmount(): void {
        window.removeEventListener("keydown", this.keyDown);
        if (this.pid !== null) clearTimeout(this.pid);
        this.mounted = false;
    }

    redrawBackground() {
        const g = this.refBackground.current?.getContext("2d");
        if (!g) return;
        drawBackground(g);
    }

    prepareTextures() {
        this.prepareResourceTextures();
        this.prepareFacilityTextures();
    }

    prepareResourceTextures() {
        const size = 256;
        const canvas = document.createElement("canvas");
        canvas.width = size;
        canvas.height = size;
        const g = canvas.getContext("2d");
        if (!g) throw new Error("Cannot paint");

        for (const type of this.game.world.resourceTypes.values()) {
            g.clearRect(0, 0, size, size);
            drawResourceTexture(type, size, g);
            this.resources.set(type.name, canvas.toDataURL())
        }
    }

    prepareFacilityTextures() {
        const facilityIdList = [
            "drill_well",
            "residential_complex",
            "solar_power_plant",
            "tranditional_mine",
        ];
        facilityIdList.forEach(id => this.resources.set(`facility:${id}`, `./assets/space-miner/facility/${id}.png`));
    }

    keyDown = (event: KeyboardEvent) => {
        if (!this.state.consoleShown && event.code === "Backquote") {
            this.setState({ consoleShown: true });
        } else if (event.code === "Space") {
            this.setState(s => ({ timeSpeed: (s.timeSpeed ? 0 : 20) }));
        }
    };

    getTimeSpeed(): double {
        return this.state.timeSpeed;
    }

    setTimeSpeed(value: double) {
        this.setState({ timeSpeed: Math.max(0, value) });
    }
}