import { ReactNode } from "react";
import { double, int } from "../../../libs/CommonTypes";
import ConfigItem from "../../../libs/config/ConfigItem";
import NumberConfigItem from "../../../libs/config/item/NumberConfigItem";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../../Game";
import ResourceItem from "../item/ResourceItem";
import { Tags } from "../item/Tags";
import Collector from "./Collector";
import Facility from "./Facility";
import "./TranditionalMineFacility.scss";

export default class TranditionalMineFacility extends Facility {

    get displayedName(): Text {
        return new I18nText(`facility.tranditional_mine.name`);
    }

    get description(): Text {
        return new I18nText(`facility.tranditional_mine.description`);
    }

    readonly collector = new HumanCollector(this);

    efficiency: double = 1.0;
    population: int = 0;
    accactableTags: Array<string> = [Tags.SOLID];

    constructor(population: int = 0, accactableTags: Array<string> = [Tags.SOLID]) {
        super();
        this.population = population;
        this.accactableTags = accactableTags;
    }

    setup(): void {
        // TODO
    }

    override tick(game: Game): void {
        if (!this.location) return;

        // 员工维生
        const liveSupport = this.location.orb.supplimentNetwork.requireLiveSupport(this.population);
        // 工业用电，只有获得维生的员工（即实际工作的员工）需要用到工业用电
        const industryElectricityFactor = 2.5;
        const electricity = this.efficiency * this.location.orb.supplimentNetwork.requireElectricity(liveSupport * industryElectricityFactor);
        this.work(electricity / (this.population * industryElectricityFactor));
    }

    work(strength: double) {
        if (!this.location) return;
        const result = this.location.orb.onDrain(this.collector, 50 * strength * this.population, this.location);
        this.location.orb.supplimentNetwork.resources.addAll(result);
    }

    copy(): Facility {
        return new TranditionalMineFacility();
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
            <div className="TranditionalMineFacility">
                <div className="config">
                    <p className="config-item">当前效率：{(this.efficiency * 100).toFixed(1)}%</p>
                    <p className="config-item">人口：{this.population}</p>
                </div>
            </div>
        );
    }
}

export class HumanCollector implements Collector {

    readonly facility: TranditionalMineFacility;
    
    constructor(facility: TranditionalMineFacility) {
        this.facility = facility;
    }

    canCollect(item: ResourceItem): boolean {
        if (item.resourceType.temperature > 80) return false;
        if (!this.facility.accactableTags.some(it => item.resourceType.tags.has(it))) return false;
        else return true;
    }
}