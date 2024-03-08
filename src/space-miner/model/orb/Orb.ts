import { double, int } from "../../../libs/CommonTypes";
import { removeFromArray } from "../../../libs/lang/Collections";
import { Nullable } from "../../../libs/lang/Optional";
import { allModulo } from "../../../libs/math/Mathmatics";
import Vector2 from "../../../libs/math/Vector2";
import Game from "../../Game";
import Collector from "../misc/Collector";
import Facility from "../facility/Facility";
import SupplimentNetwork from "../misc/SupplimentNetwork";
import Item from "../item/Item";
import MineSource from "../misc/MineSource";
import Profile from "../Profile";
import World from "../World";
import Assembler from "../assemble/Assembler";

export interface OrbBodyData {
    readonly radius: double;
    color: int;
    position: Vector2;
    rotation: double;
    rotationSpeed: double; // 自传速度
    revolutionSpeed: double; // 公转速度
}

export default abstract class Orb implements MineSource {
    readonly world: World;
    readonly uid: int;
    readonly name: string;

    readonly body: OrbBodyData;
    
    readonly supplimentNetwork = new SupplimentNetwork();
    readonly facilities: Array<Facility> = [];
    readonly assembler: Assembler;
    owner: Nullable<Profile> = null;

    abstract get maxFacilityAmount(): int;
    
    constructor(world: World, uid: int, name: string, bodyData: OrbBodyData) {
        this.world = world;
        this.uid = uid;
        this.name = name;
        this.body = bodyData;

        this.assembler = new Assembler(world.game, this);
    }

    abstract onDrain(collector: Collector, requiringAmount: double, location: InOrbLocation): Array<Item>;
    // abstract getMineralList(): Array<Item>;

    preTick(game: Game) {
        this.supplimentNetwork.preTick();
        this.facilities.filter(it => it.active).forEach(facility => facility.preTick(game));
    }

    tick(game: Game) {
        this.supplimentNetwork.tick();
        this.facilities.filter(it => it.active).forEach(facility => facility.tick(game));
        this.assembler.tick();
        this.tickBody();
    }

    postTick(game: Game) {
        this.supplimentNetwork.postTick();
        this.facilities.filter(it => it.active).forEach(facility => facility.postTick(game));
    }
    

    private tickBody() {
        
        // rotation
        this.body.rotation += this.body.rotationSpeed;
        this.body.rotation = allModulo(this.body.rotation, 2 * Math.PI);

        // revolution
        const radius = this.body.position.modulo;
        const angle = this.body.position.angle + this.body.revolutionSpeed;
        this.body.position = Vector2.fromPolar(angle, radius);
    }

    addFacility(facility: Facility): boolean {
        if (facility.location) return false;
        if (this.facilities.length >= this.maxFacilityAmount) return false;
        facility.location = {
            orb: this,
            depth: 0,
        };
        this.facilities.push(facility);
        facility.setup();
        return true;
    }

    removeFacility(facility: Facility): boolean {
        if (facility.location?.orb !== this) return false;
        facility.location = null;
        removeFromArray(this.facilities, facility);
        return true;
    }
}



export interface InOrbLocation {
    orb: Orb;
    depth: double;
    // surfacePosition: double; // 在地表的位置
}