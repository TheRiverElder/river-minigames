import { int } from "../CommonTypes";
import { constrains } from "../math/Mathmatics";
import BaseInput from "./BaseInput";
import CommonInputProps, { CommonInputLayoutProps } from "./CommonInputProps";

export interface NumberInputProps extends CommonInputProps<number>, CommonInputLayoutProps<HTMLInputElement> {
    min?: number;
    max?: number;
    step?: number;
    asRange?: boolean;
    precision?: int;
}

export function NumberInput(props: NumberInputProps) {
    return (
        <BaseInput
            {...(props as any)}
            type={props.asRange ? "range" : "number"}
            step={props.step}
            min={props.min}
            max={props.max}
            value={props.value.toFixed(props.precision)}
            onChange={s => props.onChange(constrains(parseFloat(s) || 0, props.min || 0, props.max || 0))}
        />
    )
}