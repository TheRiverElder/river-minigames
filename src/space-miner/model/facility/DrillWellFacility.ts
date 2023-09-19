import { Component } from "react";
import { double } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { Nullable } from "../../../libs/lang/Optional";
import Game from "../../Game";
import DrillWellFacilityConfigView from "../../ui/facilityconfig/DrillWellFacilityConfigView";
import DrillWellFacilityConfig from "../../ui/facilityconfig/DrillWellFacilityConfigView";
import Miner from "../miner/Miner";
import Facility from "./Facility";

export default class DrillWellFacility extends Facility {

    efficiency: double = 1.0;
    miner: Nullable<Miner> = null;

    constructor(miner: Nullable<Miner> = null) {
        super();
        this.miner = miner;
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

    createConfigUI(): Component {
        // TODO dangerous
        return new DrillWellFacilityConfigView({ facility: this });
    }
}