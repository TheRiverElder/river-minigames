import classNames from "classnames";
import { ReactNode } from "react";
import { double, int, Pair } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { sumBy } from "../../../libs/lang/Collections";
import { shortenAsHumanReadable, toPercentString } from "../../../libs/lang/Extensions";
import { constrains, TWO_PI } from "../../../libs/math/Mathmatics";
import { randomDouble } from "../../../libs/math/RandomNumber";
import Game from "../../Game";
import SpaceMinerGameClientCommonProps from "../../ui/common";
import { CreativeType } from "../io/CreativeType";
import ResourceItem from "../item/ResourceItem";
import { Tags } from "../item/Tags";
import { ResourceTypes } from "../misc/ResourceTypes";
import Facility, { FacilityProps } from "./Facility";
import "./FacilityCommon.scss";
import "./ResonatingPowerPlant.scss";

export interface ResonatingPowerPlantProps extends FacilityProps {
    readonly resonatingSourceCapacity: double;
    readonly resonatingSourceAmount?: double;
    readonly damaged?: boolean;
    readonly bonusCountdown?: int;
}

export default class ResonatingPowerPlant extends Facility {

    public static readonly TYPE = new CreativeType<Facility>("resonating_power_plant", (p, data) => new ResonatingPowerPlant({ ...p, ...data }));

    readonly resonatingSourceCapacity: double = 0;
    resonatingSourceAmount: double = 0;
    damaged: boolean = false;
    bonusCountdown: int = 0;

    tempRecordElectricity: double = 0;
    tempRecordDamagePossibility: double = 0;

    constructor(props: ResonatingPowerPlantProps) {
        super(props);
        this.resonatingSourceCapacity = props.resonatingSourceCapacity;
        this.resonatingSourceAmount = props.resonatingSourceAmount || 0;
        this.damaged = props.damaged || false;
        this.bonusCountdown = props.bonusCountdown || 0;
    }

    override get displayedName(): Text {
        return new I18nText(`facility.resonating_power_plant.name`);
    }

    override get description(): Text {
        return new I18nText(`facility.resonating_power_plant.description`);
    }

    override tick(game: Game): void {
        if (this.location) {
            const amount = this.resonatingSourceAmount * this.efficiency;
            const damagePossibility = Math.pow(constrains(amount / this.resonatingSourceCapacity, 0, 1), 12) / (24 * 30);
            this.tempRecordDamagePossibility = damagePossibility;

            if (this.damaged) {
                this.tempRecordElectricity = 0;
            } else {
                const electricity = amount === 0 ? 0 : Math.pow(1.2138, amount / 5e3);
                this.tempRecordElectricity = electricity;

                this.location.orb.supplimentNetwork.supplyElectricity(electricity, this);
                if (randomDouble(0, 1) < damagePossibility) {
                    this.damage();
                }
            }
        }
    }

    override getConfigItems(): ConfigItem<any>[] {
        const maxResonatingSourceAmount = Math.min(this.resonatingSourceCapacity, this.resonatingSourceAmount +
            sumBy(this.location?.orb.supplimentNetwork.resources.content || [],
                it => (it instanceof ResourceItem && it.hasTag(Tags.RESONATING_SOURCE)) ? it.amount : 0
            ));
        return [
            ...super.getConfigItems(),
            new NumberConfigItem("resonatingSourceAmount", new I18nText(`ui.config_view.resonating_source_amount`), 0, 0.0, maxResonatingSourceAmount, 1e3),
        ];
    }

    override getConfig(): any {
        return {
            ...super.getConfig(),
            resonatingSourceAmount: this.resonatingSourceAmount,
        };
    }

    override setConfig(value: any) {
        super.setConfig(value);
        const resonatingSourceDelta = value.resonatingSourceAmount - Math.max(0, this.resonatingSourceAmount);
        let actualResonatingSourceDelta = resonatingSourceDelta;
        if (resonatingSourceDelta > 0) {
            actualResonatingSourceDelta = this.location?.orb.supplimentNetwork.resources.remove(new ResourceItem(this.game, ResourceTypes.RESONATING_CRYSTAL, resonatingSourceDelta)).amount || 0;
        } else if (resonatingSourceDelta < 0) {
            this.location?.orb.supplimentNetwork.resources.add(new ResourceItem(this.game, ResourceTypes.RESONATING_CRYSTAL, Math.abs(resonatingSourceDelta)));
        }
        this.resonatingSourceAmount += actualResonatingSourceDelta;
    }

    override renderIcon(props: SpaceMinerGameClientCommonProps): ReactNode {
        const animationMin = 0.8 * constrains(this.resonatingSourceAmount / this.resonatingSourceCapacity, 0, 1);
        const animationAmplitude = 0.5 * (0.2 + animationMin) * (1 - animationMin);
        // const animationMax = animationMin + 2 * animationAmplitude;
        const animationMid = animationMin + animationAmplitude;
        const animationPeriod = Math.max(10, 500 * (1 / animationMin));
        const animationTime = Date.now();
        const animationFrame = this.damaged ? animationMin : (animationMid + animationAmplitude * Math.sin(TWO_PI / animationPeriod * animationTime));

        return (
            <div className="ResonatingPowerPlant FacilityCommon">
                <div className={classNames("resonating-animation", this.damaged && "damaged")} >
                    <div className="border" />
                    <div className="gear lower" />
                    <div className="body" style={{ transform: `scale(${animationFrame * 100}%)` }} />
                    <div className="gear upper" />
                </div>
            </div>
        );
    }

    override renderStatus(): ReactNode {

        return (
            <div className="ResonatingPowerPlant FacilityCommon">
                <div className="config">
                    <p className="config-item">共振源：{shortenAsHumanReadable(this.resonatingSourceAmount)} / {shortenAsHumanReadable(this.resonatingSourceCapacity)}</p>
                    <p className="config-item">效率：{toPercentString(this.efficiency)}</p>
                    <p className="config-item">产能：{shortenAsHumanReadable(this.tempRecordElectricity)} E.U.</p>
                    <p className="config-item">损坏概率：{toPercentString(this.tempRecordDamagePossibility * (24 * 30), 3)}/30d</p>
                    <p className="config-item">{this.damaged ? "已损坏" : "工作中"}</p>
                </div>
            </div>
        );
    }

    override getTools(props: SpaceMinerGameClientCommonProps): Array<Pair<Text, Function>> {
        const tools = super.getTools(props);
        if (this.damaged) {
            tools.push([
                new I18nText(`ui.facility.button.repair`),
                () => this.repair(),
            ]);
        }
        return tools;
    }

    damage() {
        this.damaged = true;
        this.resonatingSourceAmount *= (1 - randomDouble(0.1, 0.2));
    }

    repair() {
        this.damaged = false;
    }

}