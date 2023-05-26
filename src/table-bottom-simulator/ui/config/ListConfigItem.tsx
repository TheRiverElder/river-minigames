import { ReactNode } from "react";
import { int, Productor, Supplier } from "../../../libs/CommonTypes";
import Stand from "../../../libs/lang/Stand";
import { CommonInputLayoutProps } from "../../../libs/ui/CommonInputProps";
import ConfigItem from "./ConfigItem";

export interface ListConfigItemData<T> {
    getKeys: Supplier<Array<T>>;
    getKeyValue: Productor<T, string>;
    getKeyByKeyValue: Productor<string, T>;
    getName: Productor<T, string>;
    createNewRow: Supplier<T>;
}

export default class ListConfigItem<T> extends ConfigItem<Array<T>> {

    readonly getKeys: Supplier<Array<T>>;
    readonly getKeyValue: Productor<T, string>;
    readonly getKeyByKeyValue: Productor<string, T>;
    readonly getName: Productor<T, string>;
    readonly createNewRow: Supplier<T>;

    constructor(name: string, delegate: Stand<Array<T>>, data: ListConfigItemData<T>) {
        super(name, delegate);
        this.getKeys = data.getKeys;
        this.getKeyValue = data.getKeyValue;
        this.getKeyByKeyValue = data.getKeyByKeyValue;
        this.getName = data.getName;
        this.createNewRow = data.createNewRow;
    }


    render(props: CommonInputLayoutProps<any>): ReactNode {
        return (
            <div {...props}>
                {this.delegate.get().map((row, index) => (
                    <div key={index}>
                        <select
                            value={this.getName(row)}
                            onChange={e => this.onChange(index, this.getKeyByKeyValue(e.target.value))}
                        >
                            <option value={""}></option>
                            {this.getKeys().map(key => (
                                <option value={this.getKeyValue(key)}>{this.getName(key)}</option>
                            ))}
                        </select>
                    </div>
                ))}
                <div>
                    <button onClick={this.addRow}>添加</button>
                </div>
            </div>
        );
    }

    onChange(index: int, row: T) {
        const list = this.delegate.get().slice();
        list.splice(index, 1, row);
        this.delegate.set(list);
    }

    addRow = () => {
        const list = this.delegate.get().slice();
        list.push(this.createNewRow());
        this.delegate.set(list);
    };

}