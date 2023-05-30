import MinerPart from "./MinerPart";
import MinerPartType from "./MinerPartType";

export default class TestMinerPart extends MinerPart {

    override readonly type: MinerPartType;

    constructor(type: MinerPartType) {
        super();
        this.type = type;
    }

}