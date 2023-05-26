import { ReactNode } from "react";
import { int, Pair, Productor, Supplier } from "../../../libs/CommonTypes";
import Stand from "../../../libs/lang/Stand";
import { CommonInputLayoutProps } from "../../../libs/ui/CommonInputProps";
import { NumberInput } from "../../../libs/ui/NumberInput";
import ConfigItem from "./ConfigItem";

export interface ShoppingListConfigItemData<TKey> {
    getKeys: Supplier<Array<TKey>>;
    getKeyValue: Productor<TKey, string>;
    getKeyByKeyValue: Productor<string, TKey>;
    getName: Productor<TKey, string>;
    createNewRow: Supplier<Pair<TKey, int>>;
}

export default class ShoppingListConfigItem<TKey> extends ConfigItem<Array<Pair<TKey, int>>> {

    readonly getKeys: Supplier<Array<TKey>>;
    readonly getKeyValue: Productor<TKey, string>;
    readonly getKeyByKeyValue: Productor<string, TKey>;
    readonly getName: Productor<TKey, string>;
    readonly createNewRow: Supplier<Pair<TKey, int>>;

    constructor(name: string, delegate: Stand<Array<Pair<TKey, int>>>, data: ShoppingListConfigItemData<TKey>) {
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
                {this.delegate.get().map(([key, value], index) => (
                    <div key={index}>
                        <select
                            value={this.getName(key)}
                            onChange={e => this.onChange(index, [this.getKeyByKeyValue(e.target.value), value])}
                        >
                            <option value={""}></option>
                            {this.getKeys().map(key => (
                                <option value={this.getKeyValue(key)}>{this.getName(key)}</option>
                            ))}
                        </select>
                        <NumberInput
                            value={value}
                            onChange={v => this.onChange(index, [key, v])}
                        />
                    </div>
                ))}
                <div>
                    <button onClick={this.addRow}>添加</button>
                </div>
            </div>
        );
    }

    onChange(index: int, row: Pair<TKey, int>) {
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