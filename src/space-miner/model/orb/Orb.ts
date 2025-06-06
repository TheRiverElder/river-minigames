import { double, int } from "../../../libs/CommonTypes";
import { removeFromArray } from "../../../libs/lang/Collections";
import { Nullable } from "../../../libs/lang/Optional";
import { allModulo } from "../../../libs/math/Mathmatics";
import Vector2 from "../../../libs/math/Vector2";
import Game from "../global/Game";
import Collector from "../misc/Collector";
import Facility, { FacilityModel } from "../facility/Facility";
import SupplimentNetwork, { SupplimentNetworkModel } from "../misc/SupplimentNetwork";
import Item from "../item/Item";
import MineSource from "../misc/MineSource";
import Profile from "../global/Profile";
import Assembler from "../assemble/Assembler";
import { Displayable, mapModel } from "../../../libs/io/Displayable";
import World from "../global/World";
import OrbPlate from "./OrbPlate";

export interface OrbBodyData {
    readonly radius: double;
    color: int;
    position: Vector2;
    rotation: double;
    rotationSpeed: double; // 自传速度
    revolutionSpeed: double; // 公转速度
}

export default abstract class Orb implements MineSource, Displayable<OrbModel> {
    readonly world: World;
    readonly uid: int;
    readonly name: string;

    readonly body: OrbBodyData;

    readonly supplimentNetwork: SupplimentNetwork;
    readonly facilities: Array<Facility> = [];
    readonly assembler: Assembler;
    owner: Nullable<Profile> = null;

    abstract get maxFacilityAmount(): int;

    constructor(world: World, uid: int, name: string, bodyData: OrbBodyData) {
        this.world = world;
        this.uid = uid;
        this.name = name;
        this.body = bodyData;

        this.supplimentNetwork = new SupplimentNetwork(this.world.game);
        this.assembler = new Assembler(world.game, this);
    }

    getInfoModel(): Readonly<OrbInfoModel> {
        return {
            uid: this.uid,
            name: this.name,
            body: {
                radius: this.body.radius,
                color: this.body.color,
                rotation: this.body.rotation,
                position: this.body.position.toArray(),
            },
            owner: 0,
            maxFacilityAmount: this.maxFacilityAmount,
        };
    }

    getDisplayedModel(): Readonly<OrbModel> {
        return {
            uid: this.uid,
            name: this.name,
            body: { ...this.body, position: this.body.position.toArray() },
            owner: 0,
            maxFacilityAmount: this.maxFacilityAmount,
            supplimentNetwork: this.supplimentNetwork.getDisplayedModel(),
            facilities: this.facilities.map(mapModel),
        };
    }

    abstract getPlates(): Array<OrbPlate>;

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

    private nextFacilityId = 1;

    addFacility(facility: Facility): boolean {
        if (facility.location) return false;
        if (this.facilities.length >= this.maxFacilityAmount) return false;
        facility.location = {
            orb: this,
            depth: 0,
            id: this.nextFacilityId++,
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
    id: int;
    depth: double;
    // surfacePosition: double; // 在地表的位置
}

export interface OrbModel {
    readonly uid: int;
    readonly name: string;
    readonly body: OrbBodyModel;
    readonly owner: Nullable<int>;
    readonly maxFacilityAmount: int;
    readonly facilities: Array<FacilityModel>;
    readonly supplimentNetwork: SupplimentNetworkModel,
    // readonly assembler: Assembler;
};

export interface OrbInfoModel {
    readonly uid: int;
    readonly name: string;
    readonly body: OrbBodyInfoModel;
    readonly owner: Nullable<int>;
    readonly maxFacilityAmount: int;
};

export interface OrbBodyInfoModel {
    readonly radius: double;
    readonly color: int;
    readonly position: [number, number];
    readonly rotation: double;
}

export interface OrbBodyModel {
    readonly radius: double;
    readonly color: int;
    readonly position: [number, number];
    readonly rotation: double;
    readonly rotationSpeed: double;
    readonly revolutionSpeed: double;
}