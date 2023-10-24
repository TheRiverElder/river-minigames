import { Consumer } from "../../../libs/CommonTypes";
import Item from "../../model/item/Item";
import { SpaceMinerClient } from "../SpaceMinerUICommonProps";
import NumberInputDialog from "./NumberInputDialog";


export function handleSomeItem(item: Item, client: SpaceMinerClient, handle: Consumer<Item>, doCopy: boolean = true) {
    if (item.amount === 1) {
        handle(item);
        return;
    }
    client.openDialog({
        initialValue: item.amount,
        renderContent: (p) => NumberInputDialog({
            min: 0,
            max: item.amount,
            step: 1,
            value: p.value,
            onChange: p.onChange,
        }),
    }).then(amount => {
        if (amount <= 0) return;
        handle(doCopy ? item.copy(amount) : item.take(amount));
    });
}


export function handleSomeItemAndUpdateUI(item: Item, client: SpaceMinerClient, updateUI: Consumer<Item>, handle: Consumer<Item>, doCopy: boolean = true) {
    handleSomeItem(item, client, item => {
        handle(item);
        updateUI(item);
    }, doCopy);
}