import CommonInputProps from "./CommonInputProps";

export interface NumberInputProps extends CommonInputProps<number> {
    min?: number;
    max?: number;
    step?: number;
}

export function NumberInput(props: NumberInputProps) {
    return (
        <input
            type="number"
            ref={props.ref}
            className={props.className}
            style={props.style}
            min={props.min || 0}
            max={props.max || 100}
            step={props.step || 1}
            value={props.value}
            onChange={e => props.onChange(parseFloat(e.target.value) || 0)}
        />
    )
}