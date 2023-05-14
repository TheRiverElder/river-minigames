import { ReactNode } from "react";
import { CommonInputLayoutProps } from "../../../libs/ui/CommonInputProps";
import { NumberInput } from "../../../libs/ui/NumberInput";
import ConfigItem from "./ConfigItem"

export default class NumberConfigItem extends ConfigItem<number> {
    render(props: CommonInputLayoutProps): ReactNode {
        return (
            <NumberInput
                {...props}
                value={this.delegate.get()}
                onChange={v => this.delegate.set(v)}
            />
        );
    }

}