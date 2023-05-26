import { Pair, double, int } from "../../libs/CommonTypes";
import { allModulo } from "../../libs/math/Mathmatics";
import Vector2 from "../../libs/math/Vector2";
import Miner from "./Miner";
import MineSource from "./MineSource";
import MineType from "./MineType";

export interface OrbBodyData {
    radius: double;
    color: int;
    position: Vector2;
    forward: double; // 一个标定头部的角度
    rotationSpeed: double; // 自传速度
    revolutionSpeed: double; // 公转速度
}

export default class Orb extends MineSource {
    readonly uid: int;
    readonly name: string;
    readonly radius: double;
    readonly color: int;
    position: Vector2;
    forward: double; 
    readonly rotationSpeed: double; // 自传速度
    readonly revolutionSpeed: double; // 公转速度
    readonly miners: Set<Miner> = new Set();
    
    constructor(uid: int, name: string, bodyData: OrbBodyData, mineTypes: Iterable<Pair<MineType, double>>) {
        super(mineTypes);
        this.uid = uid;
        this.name = name;
        this.radius = bodyData.radius;
        this.color = bodyData.color;
        this.position = bodyData.position;
        this.forward = bodyData.forward;
        this.rotationSpeed = bodyData.rotationSpeed;
        this.revolutionSpeed = bodyData.revolutionSpeed;
    }

    override tick() {
        super.tick();

        this.miners.forEach(miner => {
            miner.orb = this;
            miner.tick();
        });
        
        // rotation
        this.forward += this.rotationSpeed;
        this.forward = allModulo(this.forward, 2 * Math.PI);

        // revolution
        const radius = this.position.modulo;
        const angle = this.position.angle + this.revolutionSpeed;
        this.position = Vector2.fromPolar(angle, radius);
    }
}