import { ReactNode } from "react";
import { Productor, Supplier } from "../../../libs/CommonTypes";
import Stand from "../../../libs/lang/Stand";
import { CommonInputLayoutProps } from "../../../libs/ui/CommonInputProps";
import ConfigItem from "./ConfigItem"

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
        getOptions: Supplier<Array<TOption>>, 
        getValue: Productor<TOption, string>, 
        getOption: Productor<string, TOption>, 
        getName: Productor<TOption, string>,
        allowNullable: boolean = true,
        nullKey: string = "<null>",
    ) {
        super(name, delegate);
        this.getOptions = getOptions;
        this.getValue = getValue;
        this.getOption = getOption;
        this.getName = getName;
        this.allowNullable = allowNullable;
        this.nullKey = nullKey;
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
                {this.getOptions().map(option => (
                    <option value={this.getValue(option)}>{this.getName(option)}</option>
                ))}
            </select>
        );
    }

}