import { ReactNode } from "react";
import { double, int, Pair } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable, toPercentString } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import { CreativeType } from "../io/CreativeType";
import Facility from "./Facility";
import "./FacilityCommon.scss";

export default class SolarPowerPlantFacility extends Facility {

    public static readonly TYPE = new CreativeType("solar_power_plant", (game, data) => new SolarPowerPlantFacility(game));
    override get type() { return SolarPowerPlantFacility.TYPE; }

    readonly solarPlaneAmount: int = 0;
    readonly bonusAmplifier: double = 1.5;
    bonusCountdown: int = 0;
    bonusCooldown: int = 0;
    
    tempRecordElectricity: double = 0;

    constructor(game: Game, solarPlaneAmount: int = 100, bonusAmplifier: double = 1.5, efficiency: int = 1.0) {
        super(game, efficiency);
        this.strength = 100;
        this.solarPlaneAmount = solarPlaneAmount;
        this.bonusAmplifier = bonusAmplifier;
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
            const delta = this.solarPlaneAmount * this.efficiency * 0.15 * amplifier;
            this.tempRecordElectricity = delta;
            this.location.orb.supplimentNetwork.supplyElectricity(delta, this);
        }
        if (this.bonusCooldown > 0) this.bonusCooldown--;
        if (this.bonusCountdown > 0) this.bonusCountdown--;
    }

    override renderIcon(props: SpaceMinerUICommonProps): ReactNode {
        return (
            <div className="SolarPowerPlantFacility FacilityCommon">
                <div className="plane"></div>
                <div className="plane"></div>
            </div>
        )
    }

    override renderStatus(): ReactNode {
        return (
            <div className="SolarPowerPlantFacility FacilityCommon">
                <div className="config">
                    <p className="config-item">太阳能板数量：{shortenAsHumanReadable(this.solarPlaneAmount)}</p>
                    <p className="config-item">当前效率：{toPercentString(this.efficiency)}</p>
                    <p className="config-item">当前产能：{shortenAsHumanReadable(this.tempRecordElectricity)} E.U.</p>
                    <p className="config-item">保养冷却：{Math.floor(this.bonusCooldown / 24)}d</p>
                    <p className="config-item">增益时效：{Math.floor(this.bonusCountdown / 24)}d</p>
                    <p className="config-item">当前增益：{toPercentString(this.bonusCountdown > 0 ? this.bonusAmplifier : 0)}</p>
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