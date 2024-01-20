import { ReactNode } from "react";
import { double, int, Pair } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable, toPercentString } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import SpaceMinerGameClientCommonProps from "../../ui/common";
import { CreativeType } from "../io/CreativeType";
import Facility, { FacilityProps } from "./Facility";
import "./FacilityCommon.scss";

export interface SolarPowerPlantFacilityProps extends FacilityProps {
    readonly solarPlaneAmount: int;
    readonly bonusAmplifier: double;
    readonly bonusCountdown?: int;
    readonly bonusCooldown?: int;
}

export default class SolarPowerPlantFacility extends Facility {

    public static readonly TYPE = new CreativeType<Facility>("solar_power_plant", (p, data) => new SolarPowerPlantFacility({ ...p, ...data }));

    readonly solarPlaneAmount: int = 0;
    readonly bonusAmplifier: double = 1.5;
    bonusCountdown: int = 0;
    bonusCooldown: int = 0;
    
    tempRecordElectricity: double = 0;

    constructor(props: SolarPowerPlantFacilityProps) {
        super(props);
        this.solarPlaneAmount = props.solarPlaneAmount;
        this.bonusAmplifier = props.bonusAmplifier;
        this.bonusCountdown = props.bonusCountdown || 0;
        this.bonusCooldown = props.bonusCooldown || 0;
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

    override renderIcon(props: SpaceMinerGameClientCommonProps): ReactNode {
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

    override getTools(props: SpaceMinerGameClientCommonProps): Pair<Text, Function>[] {
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