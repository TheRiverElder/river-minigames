import { ReactNode } from "react";
import { double, Pair } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import { Configurable } from "../../../libs/config/Configurable";
import ConfigView from "../../../libs/config/ConfigView";
import BooleanConfigItem from "../../../libs/config/item/BooleanConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import { InOrbLocation } from "../orb/Orb";

export default abstract class Facility implements Configurable {

    constructor(efficiency: double = 1.0, active: boolean = true) {
        this.efficiency = efficiency;
        this.active = active;
    }
    
    getConfigItems(): Array<ConfigItem<any>> { 
        return [
            new NumberConfigItem("efficiency", new I18nText(`ui.config_view.efficiency`), 1.0, 0.0, 1.0, 0.05),
            new BooleanConfigItem("active", new I18nText(`ui.config_view.active`), true),
        ]; 
    }

    getConfig(): any { 
        return {
            efficiency: this.efficiency,
            active: this.active,
        }; 
    }

    setConfig(value: any) {
        this.efficiency = typeof value.efficiency === "number" ? value.efficiency : this.efficiency;
        this.active = typeof value.active === "boolean" ? value.active : this.active;
    }

    name: string = "";
    location: Nullable<InOrbLocation> = null;
    strength: double = 0;
    efficiency: double = 0;
    active: boolean = false;

    get displayedName(): Text {
        return new I18nText(`facility.${this.name}.name`);
    }

    get description(): Text {
        return new I18nText(`facility.${this.name}.description`);
    }
    
    renderIcon(props: SpaceMinerUICommonProps): ReactNode { return null; }
    renderStatus(props: SpaceMinerUICommonProps): ReactNode { return null; }

    getTools(props: SpaceMinerUICommonProps): Array<Pair<Text, Function>> {
        return [
            // this.toolOpenConfigView(props),
        ];
    }

    toolOpenConfigView(props: SpaceMinerUICommonProps): Pair<Text, Function> {
        return [new I18nText(`ui.facility.button.config`), () => props.client.openTab({
            title: new I18nText(`ui.config_view.text.title`, {
                "name": this.displayedName,
            }),
            content: (<ConfigView configurable={this} i18n={props.i18n} />),
        })];
    }

    setup(): void { }

    preTick(game: Game): void { }

    tick(game: Game): void { }

    postTick(game: Game): void { }

    abstract copy(): Facility;
}