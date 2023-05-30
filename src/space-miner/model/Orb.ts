import { Pair, double, int } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import { allModulo } from "../../libs/math/Mathmatics";
import Vector2 from "../../libs/math/Vector2";
import Game from "../Game";
import ResourceItem from "./item/ResourceItem";
import Miner from "./miner/Miner";
import MineSource from "./MineSource";
import ResourceType from "./ResourceType";
import Profile from "./Profile";
import World from "./World";

export interface OrbBodyData {
    radius: double;
    color: int;
    position: Vector2;
    forward: double; // 一个标定头部的角度
    rotationSpeed: double; // 自传速度
    revolutionSpeed: double; // 公转速度
}

export default class Orb extends MineSource {
    readonly world: World;
    readonly uid: int;
    readonly name: string;

    readonly radius: double;
    readonly color: int;
    position: Vector2;
    forward: double; 
    readonly rotationSpeed: double; // 自传速度
    readonly revolutionSpeed: double; // 公转速度
    
    readonly miners: Set<Miner> = new Set();
    owner: Nullable<Profile> = null;
    
    constructor(world: World, uid: int, name: string, bodyData: OrbBodyData, mines: Iterable<ResourceItem>) {
        super(mines);
        this.world = world;
        this.uid = uid;
        this.name = name;
        this.radius = bodyData.radius;
        this.color = bodyData.color;
        this.position = bodyData.position;
        this.forward = bodyData.forward;
        this.rotationSpeed = bodyData.rotationSpeed;
        this.revolutionSpeed = bodyData.revolutionSpeed;
    }

    override tick(game: Game) {
        super.tick(game);

        this.miners.forEach(miner => miner.tick(game));

        this.tickBody();
    }

    private tickBody() {
        
        // rotation
        this.forward += this.rotationSpeed;
        this.forward = allModulo(this.forward, 2 * Math.PI);

        // revolution
        const radius = this.position.modulo;
        const angle = this.position.angle + this.revolutionSpeed;
        this.position = Vector2.fromPolar(angle, radius);
    }

    addMiner(miner: Miner): boolean {
        if (miner.location) return false;
        miner.location = {
            orb: this,
            depth: 0,
        };
        this.miners.add(miner);
        return true;
    }

    removeMiner(miner: Miner): boolean {
        if (miner.location?.orb !== this) return false;
        miner.location = null;
        this.miners.delete(miner);
        return true;
    }
}