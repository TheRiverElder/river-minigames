import { CSSProperties, MutableRefObject } from "react";
import { Consumer } from "../CommonTypes";

export interface CommonInputLayoutProps<TElement = any> {
    ref?: MutableRefObject<TElement>;
    className?: string;
    style?: CSSProperties;
}

export default interface CommonInputProps<TValue, TElement = HTMLInputElement> extends CommonInputLayoutProps<TElement> {
    value: TValue;
    onChange: Consumer<TValue>;
}