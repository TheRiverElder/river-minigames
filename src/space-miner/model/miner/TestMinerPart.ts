import MinerPart from "./MinerPart";
import MinerPartType from "./MinerPartType";

export default class TestMinerPart extends MinerPart<TestMinerPart> {

    override readonly type: MinerPartType;

    constructor(type: MinerPartType) {
        super();
        this.type = type;
    }

    override copy(): TestMinerPart {
        return new TestMinerPart(this.type);
    }

}