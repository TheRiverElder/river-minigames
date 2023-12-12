import { ReactNode } from "react";
import { double } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable, toPercentString } from "../../../libs/lang/Extensions";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import Miner from "../miner/Miner";
import Facility from "./Facility";
import "./FacilityCommon.scss";
import "./DrillWellFacility.scss";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";

export default class DrillWellFacility extends Facility {

    miner: Nullable<Miner> = null;

    constructor(miner: Nullable<Miner> = null, efficiency: double = 1.0) {
        super(efficiency);
        this.strength = 200;
        this.miner = miner;
        this.name = "drill_well";
    }

    override get displayedName(): Text {
        return new I18nText(`facility.drill_well.name`);
    }

    override get description(): Text {
        return new I18nText(`facility.drill_well.description`);
    }

    setMiner(miner: Nullable<Miner>) {
        if (this.miner) {
            this.miner.location = null;
        }
        this.miner = miner;
        this.minerSetup();
    }

    minerSetup() {
        if (!this.location || !this.miner) return;
        this.miner.location = {
            orb: this.location.orb,
            depth: this.location.depth,
        };
        this.miner.setup();
    }

    override setup(): void {
        if (this.miner) {
            this.minerSetup();
        }
    }

    override preTick(game: Game): void {
        if (!this.miner || !this.location) return;
        this.miner.preTick(game);
    }

    override tick(game: Game): void {
        if (!this.miner || !this.location || !this.miner.location) return;
        if (this.miner.location!.depth <= 0 && this.miner.mainControl.status === "resting") { // 还在地表部分
            // 清理货舱
            const item = this.miner.cargo.inventory.content[0];
            if (item) {
                const transferAmount = Math.min(item.amount, 50);
                const transferItem = item.copy(transferAmount);
                const transferedItem = this.miner.cargo.inventory.remove(transferItem);
                this.location!.orb.supplimentNetwork.resources.add(transferedItem);
            }

            // 充能
            if (this.miner.frame.energy < this.miner.frame.maxEnergy) {
                const electricity = this.location.orb.supplimentNetwork.requireElectricity(this.miner.frame.maxEnergy - this.miner.frame.energy, this);
                this.miner.frame.mutateEnergy(+electricity);
            }
        }

        this.miner.tick(game);
    }

    override postTick(game: Game): void {
        if (!this.miner || !this.location) return;
        this.miner.postTick(game);
    }

    override copy(): Facility {
        return new DrillWellFacility(this.miner?.copy(), this.efficiency);
    }

    override renderIcon(props: SpaceMinerUICommonProps): ReactNode {
        const minerLocation = this.miner?.location;
        return (
            <div className="DrillWellFacility FacilityCommon">
                <div className="drill-progress">
                    <div className="underground" />
                    <div className="gears">
                        <div className="gear" />
                        <div className="gear" />
                        <div className="gear" />
                    </div>
                    <div className="platform" />
                    <div className="bar" />
                    <div className="token" style={{ top: `${!minerLocation ? 0 : minerLocation.depth / minerLocation.orb.body.radius * 100}%` }} />
                    <div className="rings">
                        <div className="ring" />
                        <div className="ring" />
                    </div>
                </div>
            </div>
        );
    }

    override renderStatus(props: SpaceMinerUICommonProps): ReactNode {
        return (
            <div className="DrillWellFacility FacilityCommon">
                <div className="config">
                    <span className="config-item">当前效率：{toPercentString(this.efficiency)}</span>
                    {this.miner && (<span className="config-item">挖矿姬状态：{props.i18n.get(`ui.miner.status.${this.miner.mainControl.status}`)}</span>)}
                    {this.miner && (<span className="config-item">深度：{shortenAsHumanReadable(this.miner.location!.depth)}</span>)}
                    {this.miner && (<span className="config-item">电量：{shortenAsHumanReadable(this.miner.frame.energy)}/{shortenAsHumanReadable(this.miner.frame.maxEnergy)}</span>)}
                    {this.miner && (<span className="config-item">货舱：{shortenAsHumanReadable(this.miner.cargo.inventory.total)}/{shortenAsHumanReadable(this.miner.cargo.inventory.capacity)}</span>)}
                    {!this.miner && (<span className="config-item">当前没有正在工作的挖矿姬！</span>)}
                </div>
            </div>
        );
    }
}