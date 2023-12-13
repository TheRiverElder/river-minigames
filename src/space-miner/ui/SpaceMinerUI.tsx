import { Component, Consumer, createRef, CSSProperties, ReactNode } from "react";
import { double, int } from "../../libs/CommonTypes";
import I18n from "../../libs/i18n/I18n";
import I18nText from "../../libs/i18n/I18nText";
import { Nullable } from "../../libs/lang/Optional";
import Game from "../Game";
import Orb from "../model/orb/Orb";
import { initializeTestGame } from "../test/Test";
import AssemblerView from "./AssemblerView";
import DialogOverlay from "./common/DialogOverlay";
import ConsoleView from "./ConsoleView";
import DeploymentView from "./DeploymentView";
import DevelopmentCenterView from "./DevelopmentCenterView";
import { drawBackground } from "./graphics/BackgroundGraphics";
import MessageNotifier from "./MessageNotifier";
import { drawResourceTexture } from "./OrbGraphics";
import OrbInfoView from "./OrbInfoView";
import Overlay from "./Overlay";
import ShopView from "./ShopView";
import SimpleTabWindow from "./SimpleTabWindow";
import SpaceMinerI18nResource from "./SpaceMinerI18nResource";
import "./SpaceMinerUI.scss";
import SpaceMinerUICommonProps, { SpaceMinerClient, SpaceMinerClientDialog, SpaceMinerClientTab } from "./SpaceMinerUICommonProps";
import SpaceMinerUItopBar from "./SpaceMinerUItopBar";
import WarehouseView from "./WarehouseView";
import WorldView from "./WorldView";

export interface SpaceMinerUIProps {
    // game: Game;
}

type OverlayType = "shop" | "warehouse" | "assembler" | "deployment" | "development_center";
const OVERLAY_TYPES: Array<OverlayType> = ["shop", "warehouse", "assembler", "deployment", "development_center"];

export interface SpaceMinerUIState {
    orbs: Array<Orb>;
    // offset: Vector2;
    detailedOrb: Nullable<Orb>;
    consoleShown: boolean;
    tab: Nullable<SpaceMinerClientTab>;
    dialog: Nullable<ReactNode>;
    timeSpeed: double;
}

export default class SpaceMinerUI extends Component<SpaceMinerUIProps, SpaceMinerUIState> implements SpaceMinerClient {

    // get game(): Game { return this.props.game; }
    game: Game = initializeTestGame();
    i18n: I18n = new I18n(SpaceMinerI18nResource);
    resources = new Map<string, string>();

    constructor(props: SpaceMinerUIProps) {
        super(props);
        this.state = {
            orbs: Array.from(this.game.profile.ownedOrbs),
            // offset: Vector2.ZERO,
            detailedOrb: null,
            consoleShown: false,
            tab: null,
            dialog: null,
            timeSpeed: 20,
        };
    }

    openTab(tab: SpaceMinerClientTab): void {
        this.setState({ tab });
    }

    closeTab(): void {
        this.setState({ tab: null });
    }

    private refSpace = createRef<HTMLDivElement>();
    private refBackground = createRef<HTMLCanvasElement>();

    override render(): ReactNode {

        const game = this.game;
        const i18n = this.i18n;
        const resources = this.resources;
        const profile = game.profile;
        const tab = this.state.tab;
        const detailedOrb = this.state.detailedOrb;

        const mapStyle: CSSProperties = {
            // ...this.state.offset.toPositionCss(),
        };

        const commonProps = { game, i18n, resources, client: this };

        return (
            <div className="SpaceMinerUI">
                <canvas className="background" ref={this.refBackground} />
                <div ref={this.refSpace} className="space" style={mapStyle}>
                    <WorldView world={game.world} profile={profile} {...commonProps} onClickOrb={this.onClickOrb} />
                </div>

                <SpaceMinerUItopBar {...commonProps} />

                {detailedOrb && (
                    <div className="orb-info">
                        <OrbInfoView orb={detailedOrb} {...commonProps} />
                        <div className="close-button" onClick={() => this.setState({ detailedOrb: null })}>X</div>
                    </div>
                )}

                {tab && (
                    <Overlay>
                        <SimpleTabWindow tab={tab} onClose={() => this.closeTab()} {...commonProps} />
                    </Overlay>
                )}
                {/* {overlayType && (<Overlay onBack={() => this.setState({ overlayType: null })}>{this.renderOverlay(overlayType)}</Overlay>)} */}

                <div className="bottom-bar">
                    {OVERLAY_TYPES.map(t => (
                        <button
                            key={t}
                            onClick={() => this.openTab(this.createTab(t))}
                        >{i18n.get(`ui.${t}.text.title`)}</button>
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

                {this.state.dialog}

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
        const commonProps: SpaceMinerUICommonProps = { game, i18n: this.i18n, resources: this.resources, client: this };

        const title = new I18nText(`ui.${type}.text.title`);

        switch (type) {
            case "shop": return { title, content: (<ShopView {...commonProps} shop={game.shop} />) };
            case "warehouse": return { title, content: (<WarehouseView {...commonProps} profile={game.profile} inventory={game.profile.warehouse} />) };
            case "assembler": return { title, content: (<AssemblerView {...commonProps} profile={game.profile} />) };
            case "deployment": return { title, content: (<DeploymentView {...commonProps} />) };
            case "development_center": return { title, content: (<DevelopmentCenterView {...commonProps} profile={game.profile} technologies={Array.from(game.technologies)} />) };
        }
    }

    openDialog<T>(dialog: SpaceMinerClientDialog<T>): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            this.setState({
                dialog: (
                    <DialogOverlay
                        dialog={dialog}
                        resolve={v => {
                            resolve(v);
                            this.setState({ dialog: null });
                        }}
                        reject={v => {
                            reject(v);
                            this.setState({ dialog: null });
                        }}
                        i18n={this.i18n}
                        game={this.game}
                        resources={this.resources}
                        client={this}
                    />
                ),
            });
        });
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
            }
            const period = 1 / this.state.timeSpeed;
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

    set timeSpeed(value: double) {
        this.setState({ timeSpeed: Math.max(0, value) });
    }

    get timeSpeed(): double {
        return this.state.timeSpeed;
    }
}