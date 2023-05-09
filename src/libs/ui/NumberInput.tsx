import CommonInputProps from "./CommonInputProps";

export function NumberInput(props: CommonInputProps<number>) {
    return (
        <input
            type="number"
            ref={props.ref}
            className={props.className}
            style={props.style}
            value={props.value}
            onChange={e => props.onChange(parseFloat(e.target.value) || 0)}
        />
    )
}