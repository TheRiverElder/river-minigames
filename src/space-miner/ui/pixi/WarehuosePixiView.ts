import { Container, DisplayObject, Graphics, Sprite, Text, Texture } from "pixi.js";
import WrapListPixiView, { WrapListViewHolder, WrapListAdaptor } from "./WrapListPixiView";
import Inventory from "../../model/misc/storage/Inventory";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import SpaceMinerGameClientCommonProps from "../common";

export interface WarehuosePixiViewProps extends SpaceMinerGameClientCommonProps {
    warehouse: Inventory;
}

export default class WarehuosePixiView extends Container implements WrapListAdaptor<ItemViewHolder>  {

    protected props: WarehuosePixiViewProps;
    protected readonly itemListView: WrapListPixiView<ItemViewHolder>;
    protected readonly backgroundView: Graphics = new Graphics();
    protected _warehouse: Inventory;


    constructor(props: WarehuosePixiViewProps) {
        super();

        this.props = props;

        this._warehouse = props.warehouse;

        this.width = 1000;
        this.height = 500;

        this.addChild(this.backgroundView);
        this.updateBackground();

        this.itemListView = new WrapListPixiView({
            width: 800,
            height: 500,
            padding: 10,
            gap: 10,
            adaptor: this,
        });
        this.addChild(this.itemListView);

    }

    get warehouse(): Inventory { return this._warehouse; }
    set warehouse(warehouse: Inventory) {
        this._warehouse = warehouse;
        this.update();
    }

    update() {
        this.itemListView.update();
    }

    public updateBackground() {
        const background = this.backgroundView;
        background.clear();
        background
            .beginFill(0xffffff, 1)
            .drawRoundedRect(0, 0, this.width, this.height, 5);
    }
    
    get itemCount(): number {
        return this.warehouse.content.length;
    }

    onCreateViewHolder(container: Container<DisplayObject>): ItemViewHolder {
        const background = new Graphics();
        background
            .beginFill(0xffffff, 1)
            .drawRoundedRect(0, 0, 100, 100, 5);
        container.addChild(background);

        const image = new Sprite();
        container.addChild(image);
        image.width = 80;
        image.height = 80;
        image.position.set(10, 10);

        const amount = new Text("0", { fontFamily: "Consolas" });
        container.addChild(amount);
        amount.position.set(70, 80);

        container.width = 100;
        container.height = 100;

        return {
            container,
            background,
            image,
            amount,
            previousImage: "",
        };
    }

    onBindViewHolder(viewHolder: ItemViewHolder, index: number): void {
        const { image, amount, previousImage } = viewHolder;

        const item = this.warehouse.content[index];
        if (!item) {
            image.visible = false;
            amount.visible = false;
            return;
        }

        const imageResource = item.getImage(this.props.resources);
        if (imageResource != previousImage) {
            image.texture = Texture.from(imageResource);
        }
        amount.text = shortenAsHumanReadable(item.amount);
    }

}

interface ItemViewHolder extends WrapListViewHolder {
    readonly background: Graphics;
    readonly image: Sprite;
    readonly amount: Text;
    previousImage: string;
}