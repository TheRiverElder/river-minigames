
import { CSSProperties } from "react";
import ConfigItem from "../../ui/config/ConfigItem";
import Behavior from "./Behavior";

export default class BehaviorAdaptor extends Behavior {

    override handleRenderCssProperties(properties: CSSProperties): void { }
    
    override receiveInstruction(data: any): void { }

    override restore(data: any): void { }

    override onInitialize(): void { }
    override onDestroy(): void { }

    override get configItems(): ConfigItem<any>[] { return []; }

    override getTags(): string[] {
        return [];    
    }
}