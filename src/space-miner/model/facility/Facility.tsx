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
import SpaceMinerGameClientCommonProps from "../../ui/common";
import BasicPersistable from "../io/BasicPersistable";
import { ContextProps, CreativeType } from "../io/CreativeType";
import { InOrbLocation } from "../orb/Orb";

export type FacilityType = CreativeType<Facility>;

export interface FacilityValueProps {
    readonly name?: string;
    readonly strength?: double;
    readonly efficiency?: double;
    readonly active?: boolean;
}

export type FacilityProps = ContextProps<Facility> & FacilityValueProps;

export default abstract class Facility implements Configurable, BasicPersistable<Facility> {

    readonly type: CreativeType<Facility>;
    readonly game: Game;
    name: string;
    strength: double;
    efficiency: double;
    active: boolean;
    location: Nullable<InOrbLocation> = null;

    constructor(props: FacilityProps) {
        this.type = props.type;
        this.game = props.game;
        this.efficiency = props.efficiency || 1.0;
        this.active = props.active || true;
        this.strength = props.strength || 0;
        this.name = props.name || "";
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

    get displayedName(): Text {
        return new I18nText(`facility.${this.type.id}.name`);
    }

    get description(): Text {
        return new I18nText(`facility.${this.type.id}.description`);
    }
    
    renderIcon(props: SpaceMinerGameClientCommonProps): ReactNode { return null; }
    renderStatus(props: SpaceMinerGameClientCommonProps): ReactNode { return null; }

    getTools(props: SpaceMinerGameClientCommonProps): Array<Pair<Text, Function>> {
        return [
            // this.toolOpenConfigView(props),
        ];
    }

    toolOpenConfigView(props: SpaceMinerGameClientCommonProps): Pair<Text, Function> {
        return [new I18nText(`ui.facility.button.config`), () => props.uiController.openTab({
            title: new I18nText(`ui.config_view.text.title`, {
                "name": this.displayedName,
            }),
            content: (<ConfigView configurable={this} i18n={props.i18n} />),
        })];
    }

    //#region 生命周期 lifecycle

    setup(): void { }

    preTick(game: Game): void { }

    tick(game: Game): void { }

    postTick(game: Game): void { }

    //#endregion 生命周期 lifecycle

    copy(): Facility {
        const data = this.game.facilityPersistor.serialize(this, this.game);
        return this.game.facilityPersistor.deserialize(data, this.game);
    }

    onSerialize(context: Game) { }

    onDeserialize(context: Game) { }
}