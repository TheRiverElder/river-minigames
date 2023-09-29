import { ReactNode } from "react";
import { int, Pair } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import Facility from "./Facility";
import "./FacilityCommon.scss";

export default class SolarPowerPlantFacility extends Facility {

    solarPlaneAmount: int = 0;
    bonusCountdown: int = 0;
    bonusCooldown: int = 0;

    constructor(solarPlaneAmount: int) {
        super();
        this.solarPlaneAmount = solarPlaneAmount;
        this.name = "solar_power_plant";
    }

    get displayedName(): Text {
        return new I18nText(`facility.solar_power_plant.name`);
    }

    get description(): Text {
        return new I18nText(`facility.solar_power_plant.description`);
    }

    setup(): void {
        
    }

    tick(game: Game): void {
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

    copy(): Facility {
        return new SolarPowerPlantFacility(this.solarPlaneAmount);
    }

    get configItems(): ConfigItem<any>[] {
        return [
            new NumberConfigItem("solarPlaneAmount", new I18nText(`ui.config_view.solar_plane_amount`), 1.0, 0.0, 1e8, 1e4),
        ];
    }

    get config(): any {
        return {
            solarPlaneAmount: this.solarPlaneAmount,
        };
    }

    set config(value: any) {
        this.solarPlaneAmount = value.solarPlaneAmount;
    }

    renderStatus(): ReactNode {
        return (
            <div className="TranditionalMineFacility">
                <div className="config">
                    <p className="config-item">太阳能板数量：{shortenAsHumanReadable(this.solarPlaneAmount)}</p>
                    <p className="config-item">保养冷却：{this.bonusCooldown}t</p>
                    <p className="config-item">增益时效：{this.bonusCountdown}t</p>
                </div>
            </div>
        );
    }

    getTools(props: SpaceMinerUICommonProps): Pair<Text, Function>[] {
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