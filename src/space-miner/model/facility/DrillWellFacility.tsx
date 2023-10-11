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

export default class DrillWellFacility extends Facility {

    efficiency: double = 1.0;
    miner: Nullable<Miner> = null;

    constructor(miner: Nullable<Miner> = null, efficiency: double = 1.0) {
        super();
        this.miner = miner;
        this.efficiency = efficiency;
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
        if (this.miner.location!.depth >= 0) {
            this.miner.preTick(game);
        }
    }

    override tick(game: Game): void {
        if (!this.miner || !this.location || !this.miner.location) return;
        if (this.miner.location!.depth <= 0 && this.miner.mainControl.status === "resting") { // 还在地表部分
            // 清理货舱
            this.location!.orb.supplimentNetwork.resources.addAll(this.miner.cargo.inventory.clear());

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
        if (this.miner.location!.depth >= 0) {
            this.miner.postTick(game);
        }
    }

    override copy(): Facility {
        return new DrillWellFacility(this.miner?.copy(), this.efficiency);
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
            <div className="DrillWellFacility FacilityCommon">
                <div className="config">
                    <span className="config-item">当前效率：{toPercentString(this.efficiency)}</span>
                    {this.miner && (<span className="config-item">挖矿姬状态：{this.miner.mainControl.status}</span>)}
                    {this.miner && (<span className="config-item">深度：{shortenAsHumanReadable(this.miner.location!.depth)}</span>)}
                    {this.miner && (<span className="config-item">电量：{shortenAsHumanReadable(this.miner.frame.energy)}/{shortenAsHumanReadable(this.miner.frame.maxEnergy)}</span>)}
                    {this.miner && (<span className="config-item">货舱：{shortenAsHumanReadable(this.miner.cargo.inventory.total)}/{shortenAsHumanReadable(this.miner.cargo.inventory.capacity)}</span>)}
                    {!this.miner && (<span className="config-item">当前没有正在工作的挖矿姬！</span>)}
                </div>
            </div>
        );
    }
}