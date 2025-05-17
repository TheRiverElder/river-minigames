import { ReadableNumberOptions, shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import { RGB } from "../../../libs/math/Colors";
import ValueType from "./ValueType";

export default interface ValueDisplayConfig {
    readonly type: ValueType;
    readonly normalizeFunction?: (value: number) => number; // 归一化函数，用于将值归一化到0-1之间
    readonly defaultUnit?: string; // 默认显示单位
    readonly presentColor: RGB; // 显示颜色
    readonly readableNumberOptions?: ReadableNumberOptions; // 数字格式化选项
}