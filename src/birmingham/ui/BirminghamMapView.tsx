import classNames from "classnames";
import { Consumer, double, int, Productor } from "../../libs/CommonTypes";
import Vector2 from "../../libs/math/Vector2";
import { CITY_SLOTS, LINKS } from "../Constants";
import { Location } from "../Types";
import "./BirminghamMapView.scss";

export interface MapItemCollection<T> {
    isHidden: Productor<T, boolean>;
    isSelectable: Productor<T, boolean>;
    hasSelected: Productor<T, boolean>;
    onClick: Consumer<T>;
}

const DEFAULT_MAP_ITEM_COLLECTION: MapItemCollection<Location | int> = {
    isHidden: () => true,
    isSelectable: () => false,
    hasSelected: () => false,
    onClick: () => {},
}

export interface MapViewProps {
    scale?: double;
    industrySlots?: MapItemCollection<Location>;
    links?: MapItemCollection<int>;
    merchants?: MapItemCollection<Location>;
}

export default function BirminghamMapView(props: MapViewProps) {
    const scale = props.scale || 1;
    
    const citySlotSize = new Vector2(175, 175).mul(scale);
    const linkSize = new Vector2(120, 50).mul(scale);
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
                {CITY_SLOTS.filter(s => props.industrySlots && !props.industrySlots.isHidden(s.location as Location)).map(slot => (
                    <div 
                        key={slot.location.join("#")}
                        className={classNames("item", {
                            "selectable": (props.industrySlots || DEFAULT_MAP_ITEM_COLLECTION).isSelectable(slot.location as Location),
                            "selected": (props.industrySlots || DEFAULT_MAP_ITEM_COLLECTION).hasSelected(slot.location as Location),
                        })}
                        style={{
                            ...citySlotSize.toSizeCss(),
                            left: slot.position[0] * scale,
                            top: slot.position[1] * scale,
                        }}
                        onClick={() => (props.industrySlots || DEFAULT_MAP_ITEM_COLLECTION).onClick(slot.location as Location)}
                    />
                ))}
                {LINKS.filter(link => props.links && !props.links.isHidden(link.uid)).map(link => (
                    <div 
                        key={link.uid}
                        className={classNames("item", {
                            "selectable": (props.links || DEFAULT_MAP_ITEM_COLLECTION).isSelectable(link.uid),
                            "selected": (props.links || DEFAULT_MAP_ITEM_COLLECTION).hasSelected(link.uid),
                        })}
                        style={{
                            ...linkSize.toSizeCss(),
                            left: link.position[0] * scale,
                            top: link.position[1] * scale,
                        }}
                        onClick={() => (props.links || DEFAULT_MAP_ITEM_COLLECTION).onClick(link.uid)}
                    />
                ))}
            </div>
        </div>
    );
}