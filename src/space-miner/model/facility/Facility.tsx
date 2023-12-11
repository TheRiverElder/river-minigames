import { ReactNode } from "react";
import { double, Pair } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import { Configurable } from "../../../libs/config/Configurable";
import ConfigView from "../../../libs/config/ConfigView";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import { InOrbLocation } from "../orb/Orb";

export default abstract class Facility implements Configurable {
    
    get configItems(): Array<ConfigItem<any>> { return []; }
    get config(): any { return {}; }
    set config(value: any) {}

    name: string = "";
    location: Nullable<InOrbLocation> = null;
    strength: double = 0;

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