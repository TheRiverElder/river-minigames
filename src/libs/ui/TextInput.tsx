import CommonInputProps from "./CommonInputProps";

export function TextInput(props: CommonInputProps<string>) {
    return (
        <input
            type="text"
            ref={props.ref}
            className={props.className}
            style={props.style}
            value={props.value}
            onChange={e => props.onChange(e.target.value)}
        />
    )
}