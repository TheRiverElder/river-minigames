import { double } from "../../../libs/CommonTypes";
import { filterNotNull, minBy } from "../../../libs/lang/Collections";
import Bion from "../../Bion";
import BionEnvironment from "../../BionEnvironment";
import Part from "../../Part";
import PartSlot from "../../PartSlot";
import Direction from "../../program/Direction";
import { consumerDeltaByRate } from "../../util/Utils";
import { PROPERTY_TYPE_ANTIBODY, PROPERTY_TYPE_ANTIGEN, PROPERTY_TYPE_NUTRITION, PROPERTY_TYPE_SIZE, PROPERTY_TYPE_WATER } from "./NeublumenPropertyTypes";

export default class NeublumenBion extends Bion {
    
    constructor(gene: Uint8Array) {
        super(gene);
        this.createPartAt(0, 0);
    }

    public tick(env: BionEnvironment): void {
        super.tick(env);
        this.board.forEach(settlePart);
    }
}

function settlePart(slot: PartSlot) {
    // 免疫与抗原行动
    settlePartImmuning(slot);

    // 自然损耗
    settlePartNaturally(slot);

    // 水的扩散运输物质
    settlePartFlowing(slot);
}

function settlePartImmuning(slot: PartSlot) {
    const part = slot.part;
    if (!part) return;
    const properties = part.properties;

    let size = properties.get(PROPERTY_TYPE_SIZE);
    let nutrition = properties.get(PROPERTY_TYPE_NUTRITION);
    let antigen = properties.get(PROPERTY_TYPE_ANTIGEN);
    let antibody = properties.get(PROPERTY_TYPE_ANTIBODY);

    // 抗原和抗体相互抵消
    const immuningCost = Math.min(antigen, antibody);
    properties.mutate(PROPERTY_TYPE_ANTIGEN, -immuningCost);
    properties.mutate(PROPERTY_TYPE_ANTIBODY, -immuningCost);
    antigen = properties.get(PROPERTY_TYPE_ANTIGEN);

    // 如果还有剩余抗原存在，则开始搞破坏
    if (antigen > 0) {
        // 抗原破坏结构
        const destroyedSize = Math.min(size, antigen);
        properties.mutate(PROPERTY_TYPE_SIZE, -destroyedSize);  
        // 抗原繁殖
        const transformedNutrition = Math.min(nutrition, antigen);
        properties.mutate(PROPERTY_TYPE_ANTIGEN, +transformedNutrition);  
    }
}

function settlePartNaturally(slot: PartSlot) {
    const part = slot.part;
    if (!part) return;
    const properties = part.properties;

    const lossRateSize = 0.12;
    properties.mutate(PROPERTY_TYPE_SIZE, consumerDeltaByRate(lossRateSize));

    const lossRateAntibody = 0.30;
    properties.mutate(PROPERTY_TYPE_ANTIBODY, consumerDeltaByRate(lossRateAntibody));

}

function settlePartFlowing(slot: PartSlot) {
    const part = slot.part;
    if (!part) return;
    const properties = part.properties;

    let water = properties.get(PROPERTY_TYPE_WATER);

    const hydrosolubleTypes = [
        PROPERTY_TYPE_NUTRITION,
        PROPERTY_TYPE_ANTIBODY,
        PROPERTY_TYPE_ANTIGEN,
    ];

    const directions = [Direction.UP, Direction.DOWN, Direction.LEFT, Direction.RIGHT];
    const neighbours = filterNotNull(directions.map(dir => (slot.getByDirection(dir)?.part || null)));
    if (neighbours.length === 0) return;
    // const neighboursWithWaterLessThenSelf: Array<[Part, double]> = neighbours
    //         .map(n => [n, n.properties.get(PROPERTY_TYPE_WATER)] as [Part, double])
    //         .filter(([n, w]) => w < water);
    // const waterAverage = average(neighboursWithWaterLessThenSelf.map(n => n[1]).concat(water));
    
    // // 只计算出水，不计算入水，入水让别的部位计算
    // const totalMovedWater = water - waterAverage;
    // for (const type of hydrosolubleTypes) {
    //     const totalValue = properties.get(type); // 该水溶性物质的量
    //     for (const [destination, destinationWater] of neighboursWithWaterLessThenSelf) {
    //         const rate = () / totalMovedWater;
    //     }
    // }

    // 只给水最少的邻居输送
    const validNeighbors = neighbours
        .map(n => [n, n.properties.get(PROPERTY_TYPE_WATER)] as [Part, double])
        .filter(([n, w]) => w < water);
    if (validNeighbors.length === 0) return;
    const [destination, destinationWater]: [Part, double] = minBy(validNeighbors, ([_, w]) => w);
    const movedWater = water - (water + destinationWater) / 2;
    const rate = movedWater / water;
    const mutateFn = consumerDeltaByRate(rate);
    destination.properties.mutate(PROPERTY_TYPE_WATER, movedWater);
    for (const type of hydrosolubleTypes) {
        const prevValue = properties.get(type);
        properties.mutate(type, mutateFn);
        destination.properties.mutate(type, +(prevValue * rate));
    }
}