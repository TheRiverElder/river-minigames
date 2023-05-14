import { ReactNode } from "react";
import Vector2 from "../../../libs/math/Vector2";
import { CommonInputLayoutProps } from "../../../libs/ui/CommonInputProps";
import Vector2Input from "../../../libs/ui/Vector2Input";
import ConfigItem from "./ConfigItem";

export default class Vector2ConfigItem extends ConfigItem<Vector2> {
    render(props: CommonInputLayoutProps): ReactNode {
        return (
            <Vector2Input
                {...props}
                value={this.delegate.get()}
                onChange={v => this.delegate.set(v)}
            />
        );
    }

}