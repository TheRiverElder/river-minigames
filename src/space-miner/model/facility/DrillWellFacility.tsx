import { ReactNode } from "react";
import { double } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import Miner from "../miner/Miner";
import Facility from "./Facility";
import "./FacilityCommon.scss";

export default class DrillWellFacility extends Facility {

    efficiency: double = 1.0;
    miner: Nullable<Miner> = null;

    constructor(miner: Nullable<Miner> = null) {
        super();
        this.miner = miner;
        this.name = "drill_well";
    }

    get displayedName(): Text {
        return new I18nText(`facility.drill_well.name`);
    }

    get description(): Text {
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

    setup(): void {
        if (this.miner) {
            this.minerSetup();
        }
    }

    tick(game: Game): void {
        if (!this.miner || !this.location) return;
        this.miner.tick(game);
        if (this.miner.location!.depth <= 0) { // 在地表部分
            if (this.miner.mainControl.finishedCollecting) {
                this.location!.orb.supplimentNetwork.resources.addAll(this.miner.cargo.inventory.clear());
            }

            if (this.miner.frame.energy < this.miner.frame.maxEnergy) {
                const electricity = this.location.orb.supplimentNetwork.requireElectricity(this.miner.frame.maxEnergy - this.miner.frame.energy);
                this.miner.frame.energy += electricity;
            }

            if (this.miner.frame.energy >= this.miner.frame.maxEnergy) {
                this.miner.setup();
                this.miner.tick(game);
            }
        } else { // 已经进入地下
            this.miner.tick(game);
        }
    }

    copy(): Facility {
        return new DrillWellFacility(this.miner?.copy());
    }

    get configItems(): ConfigItem<any>[] {
        return [
            new NumberConfigItem("efficiency", new I18nText(`ui.config_view.efficiency`), 1.0, 0.0, 1.0, 0.05),
        ];
    }

    get config(): any {
        return {
            efficiency: this.efficiency,
        };
    }

    set config(value: any) {
        this.efficiency = value.efficiency;
    }

    override renderStatus(): ReactNode {
        return (
            <div className="DrillWellFacility">
                <div className="config">
                    <p className="config-item">当前效率：{(this.efficiency * 100).toFixed(1)}%</p>
                </div>
                {this.miner ? (
                    <div className="config">
                        <span>深度：{shortenAsHumanReadable(this.miner.location!.depth)}</span>
                        <span>电量：{shortenAsHumanReadable(this.miner.frame.energy)}/{shortenAsHumanReadable(this.miner.frame.maxEnergy)}</span>
                    </div>
                ) : (
                    <span className="empty-hint">当前没有正在工作的挖矿姬！</span>
                )}
            </div>
        );
    }
}