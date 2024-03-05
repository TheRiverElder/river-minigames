import { Container, DisplayObject, Graphics, Sprite, Text } from "pixi.js";
import Vector2 from "../../../libs/math/Vector2";
import { int } from "../../../libs/CommonTypes";

export interface WrapListPixiViewProps<TViewHolder extends WrapListViewHolder> {
    width: number;
    height: number;
    padding?: number;
    gap?: number;
    adaptor: WrapListAdaptor<TViewHolder>;
}

export default class WrapListPixiView<TViewHolder extends WrapListViewHolder> extends Container {

    protected readonly adaptor: WrapListAdaptor<TViewHolder>;

    protected _viewWidth: number;
    protected _viewHeight: number;
    protected _padding: number;
    protected _gap: number;

    get viewWidth(): number { return this._viewWidth; }
    set viewWidth(value: number) {
        this._viewWidth = value;
        this.update();
    }
    get viewHeight(): number { return this._viewHeight; }
    set viewHeight(value: number) {
        this._viewHeight = value;
        this.update();
    }

    get padding(): number { return this._padding; }
    set padding(value: number) {
        this._padding = value;
        this.update();
    }
    get gap(): number { return this._gap; }
    set gap(value: number) {
        this._gap = value;
        this.update();
    }

    protected itemsView!: Container<Container>;
    // protected scrollBarHandle!: Graphics;

    protected readonly itemViewHolderMap = new Map<int, TViewHolder>();

    constructor({
        width,
        height,
        padding = 0,
        gap = 0,
        adaptor,
    }: WrapListPixiViewProps<TViewHolder>) {
        super();

        this.adaptor = adaptor;
        this._padding = padding;
        this._gap = gap;

        // this.backgroundView = new Graphics();
        this.itemsView = new Container();

        // this.addChild(this.backgroundView);
        this.addChild(this.itemsView);

        this._viewWidth = width;
        this._viewHeight = height;

        this.update();
    }

    public update() {
        const rowWidthMax = this.viewWidth - 2 * this.padding;
        let rowWidth = 0;
        let rowHeight = 0;
        let itemY = 0;

        const adaptor = this.adaptor;
        const discardingItemIndexSet = new Set<int>(this.itemViewHolderMap.keys());

        for (let index = 0; index < adaptor.itemCount; index++) {
            const viewHolder: TViewHolder = this.itemViewHolderMap.get(index) ?? (() => {
                const itemContainer = new Container();
                const viewHolder = adaptor.onCreateViewHolder(itemContainer);
                return viewHolder;
            })();

            if (viewHolder.container.parent !== this.itemsView) {
                viewHolder.container.removeFromParent();
                this.itemsView.addChild(viewHolder.container);
            }

            discardingItemIndexSet.delete(index);

            adaptor.onBindViewHolder(viewHolder, index);

            const nextRowWidth = rowWidth + (rowWidth > 0 ? this.gap : 0) + viewHolder.container.width;
            if (nextRowWidth > rowWidthMax) {
                itemY += (rowHeight > 0 ? this.gap : 0) + rowHeight;
                rowHeight = 0;
                rowWidth = 0;
            }

            viewHolder.container.position.set(rowWidth + (rowWidth > 0 ? this.gap : 0), itemY);
            // console.log(index, viewHolder.container.width, viewHolder.container.height);
            // console.log(index, viewHolder.container.position.x, viewHolder.container.position.y);

            rowWidth += (rowWidth > 0 ? this.gap : 0) + viewHolder.container.width;
            rowHeight = Math.max(rowHeight, viewHolder.container.height);
        }

        discardingItemIndexSet.forEach((index) => {
            const viewHoder = this.itemViewHolderMap.get(index);
            if (viewHoder) {
                viewHoder.container.removeFromParent();
            }
            this.itemViewHolderMap.delete(index);
        });
    }

    private isItemVisible(itemContainer: Container) {
        return 
    }

    override onChildrenChange(_length?: number | undefined): void {
        // Do nothing    
    }


}

export interface WrapListAdaptor<T extends WrapListViewHolder> {
    get itemCount(): int;
    onCreateViewHolder(container: Container): T; 
    onBindViewHolder(viewHolder: T, index: int): void; 
}

export interface WrapListViewHolder {
    readonly container: Container;
}