import classNames from "classnames";
import { ReactNode } from "react";
import { Consumer, double, int, Productor } from "../../libs/CommonTypes";
import { Nullable } from "../../libs/lang/Optional";
import Vector2 from "../../libs/math/Vector2";
import Game from "../data/Game";
import { Location } from "../Types";
import "./BirminghamMapView.scss";

export interface MapItemCollection<T> {
    isHidden: Productor<T, boolean>;
    isSelectable: Productor<T, boolean>;
    hasSelected: Productor<T, boolean>;
    onClick: Consumer<T>;
}

const DEFAULT_MAP_ITEM_COLLECTION: MapItemCollection<int> = {
    isHidden: () => true,
    isSelectable: () => false,
    hasSelected: () => false,
    onClick: () => {},
}

export interface MapViewProps {
    game: Game;
    scale?: double;
    industrySlots?: MapItemCollection<int>;
    merchants?: MapItemCollection<int>;
    links?: MapItemCollection<int>;
}

export default function BirminghamMapView(props: MapViewProps) {
    const scale = props.scale || 1;
    const game = props.game;
    
    const totalSize = new Vector2(4000, 4000).mul(scale);

    return (
        <div className="BirminghamMapView">
            <img
                className="background"
                width={totalSize.x} 
                height={totalSize.y} 
                src="http://localhost:8089/river-minigames/birmingham/image/common/map.jpg"
            />

            <div className="items">
                {renderMapItemCollection(game.industrySlots.values(), s => s.position as [double, double], new Vector2(175, 175), props.industrySlots || null, s => s.uid, scale)}
                {renderMapItemCollection(game.merchantSlots.values(), s => s.position as [double, double], new Vector2(175, 175), props.merchants || null, s => s.uid, scale)}
                {renderMapItemCollection(game.links.values(), l => l.position as [double, double], new Vector2(120, 50), props.links || null, l => l.uid, scale)}
            </div>
        </div>
    );
}

function renderMapItemCollection<T, K>(values: Array<T>, getPosition: Productor<T, [double, double]>, size: Vector2, collection: Nullable<MapItemCollection<K>>, getKey: Productor<T, K>, scale: double = 1) {
    const c = (collection || DEFAULT_MAP_ITEM_COLLECTION) as MapItemCollection<K>;
    const s = size.mul(scale);
    const result: Array<ReactNode> = [];
    let index = 0;
    for (const value of values) {
        const key = getKey(value);
        if (!collection || collection.isHidden(key)) continue;

        const position = getPosition(value);

        result.push((
            <div 
                key={index++}
                className={classNames("item", {
                    "selectable": c.isSelectable(key),
                    "selected": c.hasSelected(key),
                })}
                style={{
                    ...s.toSizeCss(),
                    left: position[0] * scale,
                    top: position[1] * scale,
                }}
                onClick={() => c.onClick(key)}
            />
        ));
    }

    return result;
}