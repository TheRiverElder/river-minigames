import CommonInputProps from "./CommonInputProps";

export interface CheckBoxInputProps extends CommonInputProps<boolean> {
    content?: string;
}

export function CheckBoxInput(props: CheckBoxInputProps) {
    return (
        <input
            type="checkbox"
            ref={props.ref}
            className={props.className}
            style={props.style}
            checked={props.value}
            onChange={e => props.onChange(e.target.checked)}
        >
            {props.content || ""}
        </input>
    )
}