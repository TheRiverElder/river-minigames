import { Application, BaseTexture, Container, Sprite, Text, Texture } from "pixi.js";
import { Consumer, double, int } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import Registry from "../../../libs/management/Registry";
import { constrains, currentAngleOf, HALF_PI, TWO_PI } from "../../../libs/math/Mathmatics";
import Game from "../../Game";
import Orb from "../../model/orb/Orb";
import { drawLightAndShadow, drawMinerIcon, drawMinerPointer, drawOrbBody } from "../OrbGraphics";
import OrbGraphicData from "./OrbGraphicData";

export default class PixiAdapter {
    readonly game: Game;
    readonly resources: Map<string, string>;
    readonly app: Application;
    readonly shadow: Texture;
    readonly minerPointer: Texture;
    readonly minerIcon: Texture;
    onClickOrb: Nullable<Consumer<Orb>> = null;

    galaxyScale: double = 1e-7;
    orbScale: double = 3e-3;
    orbTextureSize: int = 64;

    readonly orbGaphicDataMap = new Registry<int, OrbGraphicData>(it => it.orb.uid); 

    constructor(game: Game, canvas: HTMLCanvasElement, resources: Map<string, string>) {
        this.game = game;
        this.resources = resources;
        this.app = new Application({ 
            view: canvas, 
            resizeTo: window,
            backgroundAlpha: 0,
        });
        this.shadow = this.prepareShadow();
        this.minerPointer = this.prepareMinerPointer();
        this.minerIcon = this.prepareMinerIcon();
        this.setup();
    }

    setup() {
        this.game.world.orbs.values().forEach(it => this.prepareOrb(it, false));
        this.app.stage.position.set(window.innerWidth / 2, window.innerHeight / 2);
        this.game.world.orbs.onAddListeners.add(this.onOrbAdded);
    }

    dispose() {
        this.game.world.orbs.onAddListeners.remove(this.onOrbAdded);
    }

    onOrbAdded = (orb: Orb) => {
        this.prepareOrb(orb, true);
    };

    prepareShadow() {
        const canvas = document.createElement("canvas");
        canvas.width = this.orbTextureSize;
        canvas.height = this.orbTextureSize;
        const g = canvas.getContext("2d"); 
        if (!g) throw new Error("Cannot paint");
        drawLightAndShadow(this.orbTextureSize / 2, g);
        const texture = new Texture(new BaseTexture(canvas));
        return texture;
    }

    prepareMinerPointer() {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const g = canvas.getContext("2d"); 
        if (!g) throw new Error("Cannot paint");
        drawMinerPointer(64, g);
        const texture = new Texture(new BaseTexture(canvas));
        return texture;
    }

    prepareMinerIcon() {
        const canvas = document.createElement("canvas");
        canvas.width = 64;
        canvas.height = 64;
        const g = canvas.getContext("2d"); 
        if (!g) throw new Error("Cannot paint");
        drawMinerIcon(64, g);
        const texture = new Texture(new BaseTexture(canvas));
        return texture;
    }

    prepareOrb(orb: Orb, doAnimate: boolean = false) {
        const half = this.orbTextureSize / 2;
        const canvas = document.createElement("canvas");
        canvas.width = this.orbTextureSize;
        canvas.height = this.orbTextureSize;
        const g = canvas.getContext("2d"); 
        if (!g) throw new Error("Cannot paint");

        drawOrbBody(orb, g);
        this.resources.set(`orb:${orb.uid}`, canvas.toDataURL());

        const texture = new Texture(new BaseTexture(canvas));

        const body = Sprite.from(texture);
        const bodyScale = 2 * orb.body.radius * this.orbScale / this.orbTextureSize;
        body.scale.set(bodyScale, bodyScale);
        body.anchor.set(0.5, 0.5);
        body.position.set(0, 0);

        const shadow = Sprite.from(this.shadow);
        shadow.width = body.width + 2;
        shadow.height = body.height + 2;
        // shadow.scale.set(bodyScale, bodyScale);
        shadow.anchor.set(0.5, 0.5);
        shadow.position.set(0, 0);

        const text = new Text(orb.name, { 
            fontSize: 20, 
            fill: "white", 
            stroke: "#00000080", 
            strokeThickness: 5,
        });
        text.anchor.set(0.5, 0);
        text.position.set(0, half + 10);

        const container = new Container();
        container.addChild(body, shadow, text);
        container.position.set(...orb.body.position.toArray());
        if (doAnimate) {
            container.scale.set(0, 0);
        }

        body.interactive = true;
        body.onclick = () => {
            if (this.onClickOrb) this.onClickOrb(orb);
        };

        this.app.stage.addChild(container);

        this.orbGaphicDataMap.add({
            orb,
            body,
            shadow,
            container,
            miners: [],
            text: text,
            appearTime: doAnimate ? Date.now() : -1,
        });
    }

    refresh() {
        const currentTimeMillis = Date.now();

        for (const { orb, container, body, shadow, appearTime, miners: minersData } of this.orbGaphicDataMap.values()) {
            container.position.set(...orb.body.position.mul(this.galaxyScale).toArray());
            body.rotation = orb.body.rotation;
            shadow.rotation = orb.body.position.angle;

            if (appearTime >= 0) {
                const appearAnimationDuration = 1000;
                const shownTime = constrains(currentTimeMillis - appearTime, 0, appearAnimationDuration);
                if (shownTime <= appearAnimationDuration) {
                    const animationFrame = Math.sin(HALF_PI * (shownTime / appearAnimationDuration));
                    container.scale.set(animationFrame, animationFrame);
                }
            }

            const miners = Array.from(orb.facilities);
            const angleStep = (miners.length === 0) ? 0 : (TWO_PI / miners.length);

            for (let index = 0; index < miners.length; index++) {
                const miner = miners[index];
                let minerObject = minersData[index];
                if (!minerObject) {
                    
                    const pointer = Sprite.from(this.minerPointer);
                    pointer.pivot.set(pointer.width / 2, pointer.height);
                    pointer.position.set(0, 0);
                    pointer.scale.set(0.2, 0.2);
                    const minerContainer = new Container();

                    const icon = Sprite.from(this.minerIcon);
                    icon.anchor.set(0.5, 0.5);
                    icon.scale.set(0.2, 0.2);
                    icon.position.set(0, -(pointer.height + icon.height / 2));

                    minerContainer.addChild(pointer, icon);

                    minerObject = { icon, pointer, container: minerContainer };
                    minersData[index] = minerObject;

                    container.addChild(minerContainer);
                }

                const depth = miner.location?.depth || 0;
                minerObject.container.pivot.set(0, orb.body.radius * this.orbScale - depth);
                minerObject.container.rotation = angleStep * index + currentAngleOf(10 * 1000, currentTimeMillis);
                minerObject.icon.rotation = currentAngleOf(5 * 1000, currentTimeMillis);
            }

            minersData.splice(miners.length, minersData.length - miners.length).forEach(data => data.container.parent.removeChild(data.container));
        }
    }
} 
