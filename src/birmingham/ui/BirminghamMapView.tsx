import { double, int, Productor } from "../../libs/CommonTypes";
import { CITY_SLOTS } from "../Constants";
import { Location } from "../Types";
import "./BirminghamMapView.scss";

export interface MapItemCollection<T> {
    isHidden: Productor<T, boolean>;
    isSelectable: Productor<T, boolean>;
    hasSelected: Productor<T, boolean>;
}

export interface MapViewProps {
    scale?: double;
    industrySlots?: MapItemCollection<Location>;
    links?: MapItemCollection<int>;
    merchants?: MapItemCollection<Location>;
}

export default function BirminghamMapView(props: MapViewProps) {
    const citySlotSizeRaw = 175;
    const scale = props.scale || 1;
    const citySlotSize = citySlotSizeRaw * scale;
    return (
        <div className="BirminghamMapView">
            <img
                className="background"
                width={4000 * scale} 
                height={4000 * scale} 
                src="http://localhost:8080/river-minigames/birmingham/image/map.jpg"
            />

            <div className="city-slots">
                {CITY_SLOTS.map(slot => (
                    <div 
                        className="city-slot"
                        style={{
                            width: citySlotSize,
                            height: citySlotSize,
                            left: slot.position[0] * scale,
                            top: slot.position[1] * scale,
                        }}
                    >

                    </div>
                ))}
            </div>

        </div>
    );
}