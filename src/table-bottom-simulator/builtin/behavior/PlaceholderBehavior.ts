import { CSSProperties } from "react";
import { Nullable } from "../../../libs/lang/Optional";
import AABBArea from "../../../libs/math/AABBArea";
import BehaviorAdaptor from "../../simulator/gameobject/BehaviorAdaptor";
import BehaviorType from "../../simulator/gameobject/BehaviorType";
import GameObject from "../../simulator/gameobject/GameObject";
import Side from "../../simulator/gameobject/Side";

export default class PlaceholderBehavior extends BehaviorAdaptor {

    static readonly TYPE = new BehaviorType("placeholder", Side.BOTH, (...args) => new PlaceholderBehavior(...args))

    get area(): AABBArea {
        return new AABBArea(this.host.position.sub(this.host.size.div(2)), this.host.size)
    }

    get holdingGameObjectsa(): Array<GameObject> {
        return this.simulator.gameObjects.values().filter(it => this.area.contains(it.position));
    }
    
    get holdingGameObjecta(): Nullable<GameObject> {
        return this.simulator.gameObjects.values().find(it => this.area.contains(it.position)) ?? null;
    }

    override handleRenderCssProperties(properties: CSSProperties): void {
        const placeholderProperties: CSSProperties = {
            backgroundImage: `none`,
            backgroundColor: this.simulator.selfUser.isEditor ? `#7f7f7f7f` : "transparent",
        };
        Object.assign(properties, placeholderProperties);
    }

}