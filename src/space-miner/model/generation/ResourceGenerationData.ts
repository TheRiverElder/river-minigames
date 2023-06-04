import { double, Supplier } from "../../../libs/CommonTypes";
import ResourceType from "../ResourceType";

export interface ResourceGenerationData {
    type: ResourceType;
    weight: double; // 生成权重
    veinSize: Supplier<double>; // 每次生成的尺寸
}