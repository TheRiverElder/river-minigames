import { Application, BaseTexture, Container, Sprite, Text, Texture } from "pixi.js";
import { Consumer, int } from "../../../libs/CommonTypes";
import { Nullable } from "../../../libs/lang/Optional";
import Registry from "../../../libs/management/Registry";
import Game from "../../Game";
import Orb from "../../model/orb/Orb";
import { drawOrbBody } from "../OrbGraphics";
import OrbGraphicData from "./OrbGraphicData";

export default class PixiAdapter {
    readonly game: Game;
    readonly app: Application;
    onClickOrb: Nullable<Consumer<Orb>> = null;

    readonly orbGaphicDataMap = new Registry<int, OrbGraphicData>(it => it.orb.uid); 

    constructor(game: Game, canvas: HTMLCanvasElement, ) {
        this.game = game;
        this.app = new Application({ view: canvas, resizeTo: window });
        this.setup();
    }

    setup() {
        this.game.world.orbs.values().forEach(it => this.prepareOrb(it));
        this.app.stage.position.set(this.app.stage.width / 2, this.app.stage.height / 2);
    }

    dispose() {
        // Nothing
    }

    prepareOrb(orb: Orb) {
        const radius = orb.radius;
        const half = radius;
        const canvas = document.createElement("canvas");
        canvas.width = 2 * half;
        canvas.height = 2 * half;
        const g = canvas.getContext("2d"); 
        if (!g) throw new Error("Cannot paint");

        drawOrbBody(orb, g);

        const texture = new Texture(new BaseTexture(canvas));

        const container = new Container();
        const body = Sprite.from(texture);
        const text = new Text(orb.name, { 
            fontSize: 20, 
            fill: "white", 
            stroke: "#00000080", 
            strokeThickness: 5,
        });

        container.addChild(body, text);
        body.anchor.set(0.5, 0.5);
        body.position.set(0, 0);
        text.anchor.set(0.5, 0);
        text.position.set(0, half + 10);
        container.position.set(...orb.position.toArray());

        body.interactive = true;
        body.onclick = () => {
            if (this.onClickOrb) this.onClickOrb(orb);
        };

        this.app.stage.addChild(container);

        this.orbGaphicDataMap.add({
            orb,
            body,
            container,
            text: text,
        });
    }

    refresh() {
        for (const { orb, container, body } of this.orbGaphicDataMap.values()) {
            container.position.set(...orb.position.toArray());
            body.rotation = orb.rotation;
        }
    }
} 
