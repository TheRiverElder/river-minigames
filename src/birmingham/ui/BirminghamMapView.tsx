import { double, int, Productor } from "../../libs/CommonTypes";
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
    const scale = props.scale || 1;
    return (
        <div className="BirminghamMapView">
            <img
                className="background"
                width={4000 * scale} 
                height={4000 * scale} 
                src="http://localhost:8080/river-minigames/birmingham/image/map.jpg"
            />

            
        </div>
    );
}