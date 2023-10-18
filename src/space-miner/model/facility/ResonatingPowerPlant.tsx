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
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import ResourceItem from "../item/ResourceItem";
import { Tags } from "../item/Tags";
import { ResourceTypes } from "../misc/ResourceTypes";
import Facility from "./Facility";
import "./FacilityCommon.scss";
import "./ResonatingPowerPlant.scss";

export default class ResonatingPowerPlant extends Facility {

    readonly resonatingSourceCapacity: double = 0;
    resonatingSourceAmount: double = 0;
    damaged: boolean = false;
    efficiency: double = 1;
    bonusCountdown: int = 0;

    tempRecordElectricity: double = 0;
    tempRecordDamagePossibility: double = 0;

    constructor(capacity: double, resonatingSourceAmount: double, damaged: boolean = false, efficiency: int = 1.0) {
        super();
        this.resonatingSourceCapacity = capacity;
        this.resonatingSourceAmount = resonatingSourceAmount;
        this.damaged = damaged;
        this.efficiency = efficiency;
        this.name = "resonating_power_plant";
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
                const electricity = Math.pow(1.2138, amount / 5e3);
                this.tempRecordElectricity = electricity;

                this.location.orb.supplimentNetwork.supplyElectricity(electricity, this);
                if (randomDouble(0, 1) < damagePossibility) {
                    this.damage();
                }
            }
        }
    }

    override copy(): Facility {
        return new ResonatingPowerPlant(this.resonatingSourceCapacity, this.resonatingSourceAmount, this.damaged, this.efficiency);
    }

    override get configItems(): ConfigItem<any>[] {
        const maxResonatingSourceAmount = Math.min(this.resonatingSourceCapacity, this.resonatingSourceAmount +
            sumBy(this.location?.orb.supplimentNetwork.resources.content || [],
                it => (it instanceof ResourceItem && it.hasTag(Tags.RESONATING_SOURCE)) ? it.amount : 0
            ));
        return [
            new NumberConfigItem("efficiency", new I18nText(`ui.config_view.efficiency`), 1.0, 0.0, 1.0, 0.05),
            new NumberConfigItem("resonatingSourceAmount", new I18nText(`ui.config_view.resonating_source_amount`), 0, 0.0, maxResonatingSourceAmount, 1e3),
        ];
    }

    override get config(): any {
        return {
            efficiency: this.efficiency,
            resonatingSourceAmount: this.resonatingSourceAmount,
        };
    }

    override set config(value: any) {
        this.efficiency = value.efficiency;
        const resonatingSourceDelta = value.resonatingSourceAmount - Math.max(0, this.resonatingSourceAmount);
        let actualResonatingSourceDelta = resonatingSourceDelta;
        if (resonatingSourceDelta > 0) {
            actualResonatingSourceDelta = this.location?.orb.supplimentNetwork.resources.remove(new ResourceItem(ResourceTypes.RESONATING_CRYSTAL, resonatingSourceDelta)).amount || 0;
        } else if (resonatingSourceDelta < 0) {
            this.location?.orb.supplimentNetwork.resources.add(new ResourceItem(ResourceTypes.RESONATING_CRYSTAL, Math.abs(resonatingSourceDelta)));
        }
        this.resonatingSourceAmount += actualResonatingSourceDelta;
    }

    override renderStatus(): ReactNode {
        const animationMin = 0.8 * constrains(this.resonatingSourceAmount / this.resonatingSourceCapacity, 0, 1);
        const animationAmplitude = 0.5 * (0.2 + animationMin) * (1 - animationMin);
        const animationMax = animationMin + 2 * animationAmplitude;
        const animationMid = animationMin + animationAmplitude;
        const animationPeriod = Math.max(10, 500 * (1 / animationMin));
        const animationTime = Date.now();
        const animationFrame = this.damaged ? animationMin : (animationMid + animationAmplitude * Math.sin(TWO_PI / animationPeriod * animationTime));

        return (
            <div className="ResonatingPowerPlant FacilityCommon">
                <div className="config">
                    <p className="config-item">共振源：{shortenAsHumanReadable(this.resonatingSourceAmount)} / {shortenAsHumanReadable(this.resonatingSourceCapacity)}</p>
                    <p className="config-item">效率：{toPercentString(this.efficiency)}</p>
                    <p className="config-item">产能：{shortenAsHumanReadable(this.tempRecordElectricity)} E.U.</p>
                    <p className="config-item">损坏概率：{toPercentString(this.tempRecordDamagePossibility * (24 * 30))}/30d</p>
                    <p className="config-item">{this.damaged ? "已损坏" : "工作中"}</p>
                </div>
                <div className={classNames("resonating-animation", this.damaged && "damaged")} >
                    <div className="border"/>
                    <div className="body" style={{ transform: `scale(${animationFrame * 100}%)` }} />
                </div>
            </div>
        );
    }

    override getTools(props: SpaceMinerUICommonProps): Array<Pair<Text, Function>> {
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