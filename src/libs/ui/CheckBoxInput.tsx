import CommonInputProps, { CommonInputLayoutProps } from "./CommonInputProps";

export function CheckBoxInput(props: CommonInputProps<boolean> & CommonInputLayoutProps) {
    return (
        <input
            type="checkbox"
            ref={props.ref}
            className={props.className}
            style={props.style}
            checked={props.value}
            onChange={e => props.onChange(e.target.checked)}
        />
    )
}