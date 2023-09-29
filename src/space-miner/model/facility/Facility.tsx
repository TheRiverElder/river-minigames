import { ReactNode } from "react";
import { Pair } from "../../../libs/CommonTypes";
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
    
    abstract get configItems(): ConfigItem<any>[];
    abstract get config(): any;
    abstract set config(value: any);

    name: string = "";
    location: Nullable<InOrbLocation> = null;

    abstract get displayedName(): Text;
    abstract get description(): Text;
    
    abstract renderStatus(): ReactNode;

    getTools(props: SpaceMinerUICommonProps): Array<Pair<Text, Function>> {
        return [
            [new I18nText(`ui.facility.button.config`), () => props.client.openTab({
                title: new I18nText(`ui.config_view.text.title`, {
                    "name": this.displayedName,
                }),
                content: (<ConfigView configurable={this} i18n={props.i18n} />),
            })],
        ];
    }

    abstract setup(): void;
    abstract tick(game: Game): void;
    abstract copy(): Facility;
}