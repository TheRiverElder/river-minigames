import { ReactNode } from "react";
import { CheckBoxInput } from "../../../libs/ui/CheckBoxInput";
import { CommonInputLayoutProps } from "../../../libs/ui/CommonInputProps";
import ConfigItem from "./ConfigItem"

export default class BooleanConfigItem extends ConfigItem<boolean> {
    render(props: CommonInputLayoutProps): ReactNode {
        return (
            <CheckBoxInput
                {...props}
                value={this.delegate.get()}
                onChange={v => this.delegate.set(v)}
            />
        );
    }

}