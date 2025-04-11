import Vector2 from "../../../libs/math/Vector2";
import Facility from "../facility/Facility";
import Item from "../item/Item";

export default class OrbPlate {

    public name: string = "";
    public facility: Facility | null = null; // 该板块被哪个设施所占用
    public resources = Array<Item>; // 该板块的自然资源


    constructor(
        public readonly position: Vector2,
    ) { }

}