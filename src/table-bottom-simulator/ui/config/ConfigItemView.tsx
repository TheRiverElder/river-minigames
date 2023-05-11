import { Component, ReactNode } from "react";
import { CheckBoxInput } from "../../../libs/ui/CheckBoxInput";
import { NumberInput } from "../../../libs/ui/NumberInput";
import { TextInput } from "../../../libs/ui/TextInput";
import Vector2Input from "../../../libs/ui/Vector2Input";
import ConfigItem from "./ConfigItem";
import { CONFIG_ITEM_TYPE_BOOLEAN, CONFIG_ITEM_TYPE_NUMBER, CONFIG_ITEM_TYPE_TEXT, CONFIG_ITEM_TYPE_VECTOR2 } from "./ConfigItems";

export interface ConfigItemViewProps {
    item: ConfigItem;
}

export default class ConfigItemView extends Component<ConfigItemViewProps> {
    render(): ReactNode {
        const item = this.props.item;
        switch(item.type) {
            case CONFIG_ITEM_TYPE_NUMBER: return (
                <NumberInput 
                    value={item.delegate.get()}
                    onChange={v => item.delegate.set(v)}
                />
            );
            case CONFIG_ITEM_TYPE_BOOLEAN: return (
                <CheckBoxInput 
                    value={item.delegate.get()}
                    onChange={v => item.delegate.set(v)}
                />
            );
            case CONFIG_ITEM_TYPE_TEXT: return (
                <TextInput 
                    value={item.delegate.get()}
                    onChange={v => item.delegate.set(v)}
                />
            );
            case CONFIG_ITEM_TYPE_VECTOR2: return (
                <Vector2Input 
                    value={item.delegate.get()}
                    onChange={v => item.delegate.set(v)}
                />
            );
        }
    }
}