import { CSSProperties, MutableRefObject } from "react";
import { Consumer } from "../CommonTypes";

export interface CommonInputLayoutProps<TElement = HTMLElement> {
    ref?: MutableRefObject<TElement>;
    className?: string;
    style?: CSSProperties;
}

export default interface CommonInputProps<TValue> {
    value: TValue;
    onChange: Consumer<TValue>;
    changeOnBlur?: boolean; // 默认为false
    changeOnKey?: boolean; // 默认为true
    changeOnEnter?: boolean; // 默认为false
}