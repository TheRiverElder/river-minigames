import { ReactNode } from "react";
import { Productor, Supplier } from "../../../libs/CommonTypes";
import Stand from "../../../libs/lang/Stand";
import { CommonInputLayoutProps } from "../../../libs/ui/CommonInputProps";
import ConfigItem from "./ConfigItem"

export interface SelectConfigItemData<TOption> {
    getOptions: Supplier<Array<TOption>>;
    getValue: Productor<TOption, string>;
    getOption: Productor<string, TOption>;
    getName: Productor<TOption, string>;
    allowNullable?: boolean;
    nullKey?: string;
}

export default class SelectConfigItem<TOption> extends ConfigItem<TOption> {
    
    readonly getOptions: Supplier<Array<TOption>>;
    readonly getValue: Productor<TOption, string>;
    readonly getOption: Productor<string, TOption>;
    readonly getName: Productor<TOption, string>;
    readonly allowNullable: boolean;
    readonly nullKey: string;

    constructor(
        name: string, 
        delegate: Stand<TOption>, 
        data: SelectConfigItemData<TOption>,
    ) {
        super(name, delegate);
        this.getOptions = data.getOptions;
        this.getValue = data.getValue;
        this.getOption = data.getOption;
        this.getName = data.getName;
        this.allowNullable = !data.allowNullable;
        this.nullKey = data.nullKey || "<null>";
    }
    
    render(props: CommonInputLayoutProps): ReactNode {
        return (
            <select
                {...props}
                value={this.getValue(this.delegate.get()) || this.nullKey}
                onChange={e => this.delegate.set(this.getOption(e.target.value))}
            >
                {this.allowNullable && (
                    <option value={this.nullKey}>{this.nullKey}</option>
                )}
                {this.getOptions().map((option, i) => (
                    <option key={i} value={this.getValue(option)}>{this.getName(option)}</option>
                ))}
            </select>
        );
    }

}