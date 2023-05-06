import { Consumer, double, int } from "../libs/CommonTypes";
import Registry from "../libs/management/Registry";
import Vector2 from "../libs/math/Vector2";
import ActionType, { ACTION_TYPE_BUILD, ACTION_TYPE_LOAN, ACTION_TYPE_NETWORK, ACTION_TYPE_SCOUT, ACTION_TYPE_SELL } from "./action/ActionType";
import Card from "./Card";
import City from "./City";
import Factory from "./Factory";
import FactorySlot from "./FactorySlot";
import GameMap from "./GameMap";
import Industry from "./Industry";
import IndustrySlot from "./IndustrySlot";
import Market from "./Market";
import Player from "./Player";
import ResourceType from "./ResourceType";
import Traffic from "./traffic/Traffic";
import { TrafficType } from "./traffic/TrafficType";
import Updatable from "./Updatable";
import { UpdatableUnique } from "./UpdatableUnique";
import UpdatePack from "./update/UpdatePack";

export default class Game implements UpdatableUnique {
    uid: int = 0;
    readonly map: GameMap;

    public readonly factories = new Registry<int, Factory>(o => o.uid);
    public readonly players = new Registry<int, Player>(o => o.uid);

    public readonly industries = new Registry<string, Industry>(o => o.name);
    public readonly resourceTypes = new Registry<string, ResourceType>(o => o.name);
    public readonly trafficTypes = new Registry<string, TrafficType>(o => o.name);
    public readonly actionTypes = new Registry<string, ActionType>(o => o.name);
    
    public readonly markets = new Registry<ResourceType, Market>(o => o.resourceType);

    public playersInOrder: Array<Player> = [];
    turnIndex: int;
    era: int = 0;

    // 客户端不需要这个
    // public readonly uidGenerator = new IncrementNumberGenerator();
    public readonly updateListeners = new Map<int, Updatable>();

    public readonly uiUpdateListeners = new Set<Consumer<Game>>();

    constructor() {
        this.map = new GameMap(Vector2.ZERO, Vector2.ZERO, []);
        this.turnIndex = 0;
    }

    getCurrentPlayer(): Player {
        const player = this.playersInOrder[this.turnIndex];
        if (!player) throw new Error("当前没有玩家！");
        return player;
    }

    turn() {
        this.turnIndex++;
        if (this.turnIndex >= this.playersInOrder.length) {
            this.recalculateTurn();
            this.turnIndex = 0;
        }
    }

    recalculateTurn() {
        this.playersInOrder = Array.from(this.players.values()).sort((a, b) => a.cost - b.cost);
    }

    updateUI() {
        this.uiUpdateListeners.forEach(l => l(this));
    }

    listenUpdate(obj: UpdatableUnique) {
        this.updateListeners.set(obj.uid, obj);
    }

    update(...packs: Array<UpdatePack>) {
        for (const pack of packs) {
            const updatable = this.updateListeners.get(pack.uid);
            if (!updatable) continue;
            updatable.update(pack.data);
        }
        this.updateUI();
    }

    initialize(data: any) {

        this.actionTypes.add(ACTION_TYPE_SCOUT);
        this.actionTypes.add(ACTION_TYPE_LOAN);
        this.actionTypes.add(ACTION_TYPE_BUILD);
        this.actionTypes.add(ACTION_TYPE_SELL);
        this.actionTypes.add(ACTION_TYPE_NETWORK);

        const vec = (data: { x: double, y: double }) => new Vector2(data.x, data.y);
        const res = (name: string) => this.resourceTypes.getOrThrow(name);
        const trf = (name: string) => this.trafficTypes.getOrThrow(name);
        const cty = (name: string) => this.map.cities.getOrThrow(name);
        const ind = (name: string) => this.industries.getOrThrow(name);
        const fac = (uid: int) => uid < 0 ? null : this.factories.getOrThrow(uid);
        const ply = (uid: int) => uid < 0 ? null : this.players.getOrThrow(uid);

        this.uid = data.uid;
        this.listenUpdate(this);
        this.era = data.era;

        for (const rtd of data.resourceTypes) {
            this.resourceTypes.add(new ResourceType(rtd.name));
        }

        for (const id of data.industries) {
            this.industries.add(new Industry(id.name));
        }

        for (const md of data.markets) {
            this.markets.add(new Market(this, md.uid, res(md.resourceType), md.capacityLevel, md.amount));
        }

        for (const ttd of data.trafficTypes) {
            this.trafficTypes.add(new TrafficType(
                ttd.name, 
                ttd.era,
                ttd.costsByAmount.map((costs: [string, int][]) => costs.map(([rt, amount]) => [res(rt), amount])),
            ));
        }

        this.map.industrySlotSize = vec(data.map.industrySlotSize);
        this.map.size = vec(data.map.size);
        for (const cd of data.map.cities) {
            const city = new City(cd.name, vec(cd.centerPosition), [], [], null);
            for (const isd of cd.industrySlots) {
                city.industrySlots.push(new IndustrySlot(
                    this, isd.uid, 
                    city,
                    vec(isd.position), 
                    isd.industries.map(ind),
                    fac(isd.factory),
                ));
            }
            this.map.cities.add(city);
        }
        for (const td of data.map.traffics) {
            this.map.traffics.push(new Traffic(this, td.uid, trf(td.type), vec(td.position), cty(td.head), cty(td.tail), ply(td.owner)));
        }

        for (const pd of data.players) {
            const player = new Player(this, pd.uid, pd.name, pd.income, pd.account, pd.score, [], []);
            player.cost = pd.cost;
            player.factorySlots.push(...pd.factorySlots.map((fsd: any) => {
                const slot = new FactorySlot(
                    ind(fsd.industry),
                    player,
                    fsd.cost.map(([rt, amount]: [string, int]) => [res(rt), amount]),
                    fsd.award.map(([rt, amount]: [string, int]) => [res(rt), amount]),
                    Vector2.ZERO,
                    res(fsd.resourceType),
                    [],
                );
                slot.factories.push(...fsd.factories.map((fd: any) => new Factory(
                    fd.uid,
                    slot,
                    fd.resourceAmount,
                    fd.sold,
                )));
                return slot;
            }));
            player.cards.push(...pd.cards.map((cd: any) => new Card(cd.uid, cd.name, cty(cd.city), ind(cd.industry))));
            this.players.add(player);
        }
        this.playersInOrder = data.playersInOrder.map(ply);
        this.turnIndex = data.turnIndex;

        this.updateUI();
    }

}