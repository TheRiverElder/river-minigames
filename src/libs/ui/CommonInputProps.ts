import { CSSProperties, MutableRefObject } from "react";
import { Consumer } from "../CommonTypes";

export default interface CommonInputProps<TValue, TElement = HTMLInputElement> {
    ref?: MutableRefObject<TElement>;
    className?: string;
    style?: CSSProperties;
    value: TValue;
    onChange: Consumer<TValue>;
}