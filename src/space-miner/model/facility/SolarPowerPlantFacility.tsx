import { ReactNode } from "react";
import { double, int, Pair } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable, toPercentString } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import Facility from "./Facility";
import "./FacilityCommon.scss";

export default class SolarPowerPlantFacility extends Facility {

    readonly solarPlaneAmount: int = 0;
    efficiency: double = 1;
    bonusCountdown: int = 0;
    bonusCooldown: int = 0;

    constructor(solarPlaneAmount: int, efficiency: int = 1.0) {
        super();
        this.solarPlaneAmount = solarPlaneAmount;
        this.efficiency = efficiency;
        this.name = "solar_power_plant";
    }

    override get displayedName(): Text {
        return new I18nText(`facility.solar_power_plant.name`);
    }

    override get description(): Text {
        return new I18nText(`facility.solar_power_plant.description`);
    }

    override tick(game: Game): void {
        if (this.location) {
            let amplifier = 1.0;
            if (this.bonusCountdown > 0) {
                amplifier = 1.5;
            }
            this.location.orb.supplimentNetwork.battery += this.solarPlaneAmount * amplifier;
        }
        if (this.bonusCooldown > 0) this.bonusCooldown--;
        if (this.bonusCountdown > 0) this.bonusCountdown--;
    }

    override copy(): Facility {
        return new SolarPowerPlantFacility(this.solarPlaneAmount, this.efficiency);
    }

    override get configItems(): ConfigItem<any>[] {
        return [
            new NumberConfigItem("efficiency", new I18nText(`ui.config_view.efficiency`), 1.0, 0.0, 1.0, 0.05),
        ];
    }

    override get config(): any {
        return {
            efficiency: this.efficiency,
        };
    }

    override set config(value: any) {
        this.efficiency = value.efficiency;
    }

    override renderStatus(): ReactNode {
        return (
            <div className="TranditionalMineFacility FacilityCommon">
                <div className="config">
                    <p className="config-item">太阳能板数量：{shortenAsHumanReadable(this.solarPlaneAmount)}</p>
                    <p className="config-item">当前效率：{toPercentString(this.efficiency)}</p>
                    <p className="config-item">保养冷却：{this.bonusCooldown}t</p>
                    <p className="config-item">增益时效：{this.bonusCountdown}t</p>
                </div>
            </div>
        );
    }

    override getTools(props: SpaceMinerUICommonProps): Pair<Text, Function>[] {
        const tools = super.getTools(props);
        if (this.bonusCooldown <= 0) {
            tools.push([new I18nText(`ui.facility.button.maintain`), () => this.maintain()]);
        }
        return tools;
    }

    maintain() {
        this.bonusCooldown = 2 * 60 * 20;
        this.bonusCountdown = 60 * 20;
    }

}