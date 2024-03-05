import BaseInput from "./BaseInput";
import CommonInputProps from "./CommonInputProps";

export function TextInput(props: CommonInputProps<string>) {
    return (
        <BaseInput
            {...props}
            type="text"
            value={props.value}
            onChange={props.onChange}
        />
    )
}