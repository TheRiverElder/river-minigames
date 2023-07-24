import { BaseTexture, loadTextures, Texture } from "pixi.js";
import Game from "../../Game";
import Orb from "../../model/orb/Orb";
import { drawOrbBody } from "../OrbGraphics";

export default class PixiAdapter {
    readonly game: Game;

    constructor(game: Game) {
        this.game = game;
        this.setup();
    }

    setup() {
        this.game.world.orbs.values().forEach(it => this.prepareTexture(it));
    }

    prepareTexture(orb: Orb): Texture {
        const radius = orb.radius;
        const half = radius;
        const canvas = document.createElement("canvas");
        canvas.width = 2 * half;
        canvas.height = 2 * half;
        const g = canvas.getContext("2d"); 
        if (!g) throw new Error("Cannot paint");

        drawOrbBody(orb, g);

        canvas.toDataURL();

        const base = new BaseTexture(canvas);
        const texture = new Texture(base);

        return texture;
    }
} 
