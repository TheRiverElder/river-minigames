import { ReactNode } from "react";
import Stand from "../../../libs/lang/Stand";
import { CommonInputLayoutProps } from "../../../libs/ui/CommonInputProps";

export default abstract class ConfigItem<T = any> {
    readonly name: string;
    readonly delegate: Stand<T>;

    constructor(name: string, delegate: Stand<T>) {
        this.name = name;
        this.delegate = delegate;
    }

    abstract render(props: CommonInputLayoutProps): ReactNode;
}