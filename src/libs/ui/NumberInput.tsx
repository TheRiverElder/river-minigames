import BaseInput from "./BaseInput";
import CommonInputProps, { CommonInputLayoutProps } from "./CommonInputProps";

export interface NumberInputProps extends CommonInputProps<number>, CommonInputLayoutProps<HTMLInputElement> {
    min?: number;
    max?: number;
    step?: number;
    asRange?: boolean;
}

export function NumberInput(props: NumberInputProps) {
    return (
        <BaseInput
            {...(props as any)}
            type={props.asRange ? "range" : "number"}
            step={props.step}
            min={props.min}
            max={props.max}
            value={props.value.toString()}
            onChange={s => props.onChange(parseFloat(s) || 0)}
        />
    )
}