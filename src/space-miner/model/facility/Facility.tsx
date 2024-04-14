import { ReactNode } from "react";
import { double, int, Pair } from "../../../libs/CommonTypes";
// import ConfigItem from "../../../libs/config/ConfigItem";
// import { Configurable } from "../../../libs/config/Configurable";
// import ConfigView from "../../../libs/config/ConfigView";
// import BooleanConfigItem from "../../../libs/config/item/BooleanConfigItem";
// import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text, { TextModel } from "../../../libs/i18n/Text";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../global/Game";
import BasicPersistable from "../io/BasicPersistable";
import { CreativeType } from "../io/CreativeType";
import { InOrbLocation } from "../orb/Orb";
// import GenericFacilityDetailView, { DisplayedPair } from "../../ui/facility/GenericFacilityDetailView";
import PlainText from "../../../libs/i18n/PlainText";
import { toPercentString } from "../../../libs/lang/Extensions";
import { Displayable } from "../../../libs/io/Displayable";
import { SpaceMinerGameClientCommonProps } from "../../ui/common";

export type FacilityType = CreativeType<Facility>;

export interface FacilityProps {
    readonly type: FacilityType;
    readonly game: Game;
    readonly name?: string;
    readonly strength?: double;
    readonly efficiency?: double;
    readonly active?: boolean;
}

export default abstract class Facility implements /*Configurable,*/ BasicPersistable<Facility>, Displayable<FacilityModel> {

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
    
    getDisplayedModel(): Readonly<FacilityModel> {
        return {
            type: this.type.id,
            name: this.name,
            displayedName: this.displayedName.getDisplayedModel(),
            description: this.description.getDisplayedModel(),
            strength: this.strength,
            efficiency: this.efficiency,
            active: this.active,
            location: this.location ? {
                orb: this.location.orb.uid,
                depth: this.location.depth,
            } : null,
            statusList: this.getStatusList(),
            acceptableOperationList: this.getAcceptableOperationList(),
        };
    }
    
    // getConfigItems(): Array<ConfigItem<any>> { 
    //     return [
    //         // new NumberConfigItem("efficiency", new I18nText(`ui.config_view.efficiency`), 1.0, 0.0, 1.0, 0.05),
    //         // new BooleanConfigItem("active", new I18nText(`ui.config_view.active`), true),
    //     ]; 
    // }

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
    
    renderIcon(_props: SpaceMinerGameClientCommonProps): ReactNode { return null; }

    // renderStatus(props: SpaceMinerGameClientCommonProps): ReactNode {
    //     return (<GenericFacilityDetailView {...props} facility={this}/>);
    // }

    getStatusList(): Array<DisplayedStatus> {
        return [
            {
                name: new PlainText("状态").getDisplayedModel(),
                value: new PlainText(this.active ? "启用" : "休眠").getDisplayedModel(),
            },
            {
                name: new PlainText("当前效率").getDisplayedModel(),
                value: new PlainText(toPercentString(this.efficiency)).getDisplayedModel(),
                progress: this.efficiency,
                width: 16,
            },
        ];
    }

    getDisplayedProgresses(): Array<[Text, double]> {
        return [];
    }

    getAcceptableOperationList(): Array<DisplayedOperation> {
        return [
            // this.toolOpenConfigView(props),
        ];
    }

    acceptOperation(_key: string) { }

    // toolOpenConfigView(props: SpaceMinerGameClientCommonProps): Pair<Text, Function> {
    //     return [new I18nText(`ui.facility.button.config`), () => props.uiController.openTab({
    //         title: new I18nText(`ui.config_view.text.title`, {
    //             "name": this.displayedName,
    //         }),
    //         content: (<ConfigView configurable={this} i18n={props.i18n} />),
    //     })];
    // }

    //#region 生命周期 lifecycle

    setup(): void { }

    preTick(_game: Game): void { }

    tick(_game: Game): void { }

    postTick(_game: Game): void { }

    //#endregion 生命周期 lifecycle

    copy(): Facility {
        const data = this.game.facilityPersistor.serialize(this, this.game);
        return this.game.facilityPersistor.deserialize(data, this.game);
    }

    onSerialize(_context: Game) { }

    onDeserialize(_context: Game) { }
}

export type FacilityModel = {
    readonly type: string;
    readonly name: string;
    readonly displayedName: TextModel;
    readonly description: TextModel;
    readonly strength: double;
    readonly efficiency: double;
    readonly active: boolean;
    readonly location: Nullable<{
        readonly orb: int;
        readonly depth: double;
    }>;
    readonly statusList: Array<DisplayedStatus>;
    readonly acceptableOperationList: Array<DisplayedOperation>;
};

export interface DisplayedStatus {
    readonly name: TextModel;
    readonly value: TextModel;
    readonly progress?: double;
    readonly width?: int;
}

export interface DisplayedOperation {
    readonly key: string;
    readonly text?: TextModel;
}