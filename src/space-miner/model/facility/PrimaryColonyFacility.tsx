import { ReactNode } from "react";
import { shortenAsHumanReadable, toPercentString } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import Facility from "./Facility";
import "./FacilityCommon.scss";
import "./PrimaryColonyFacility.scss";
import SpaceMinerGameClientCommonProps from "../../ui/common";
import ResourceItem from "../item/ResourceItem";
import Collector from "../misc/Collector";
import { CreativeType } from "../io/CreativeType";
import Inventory from "../misc/storage/Inventory";
import Text from "../../../libs/i18n/Text";
import PlainText from "../../../libs/i18n/PlainText";
import { DisplayedPair } from "../../ui/facility/GenericFacilityDetailView";

export default class PrimaryColonyFacility extends Facility implements Collector {

    public static readonly TYPE = new CreativeType<Facility>("primary_colony", (game, data) => new PrimaryColonyFacility(game));

    readonly storage: Inventory = new Inventory(100);

    override tick(game: Game): void {
        if (!this.location || this.efficiency <= 0) return;

        this.location.orb.supplimentNetwork.supplyElectricity(50 / (20 * 60) * this.efficiency, this);
        this.location.orb.supplimentNetwork.supplyLiveSupport(1 / (20 * 60) * this.efficiency, this);

        const resources = this.location.orb.onDrain(this, 2 / (20 * 60) * this.efficiency, this.location);
        this.storage.addAll(resources);
        if (this.storage.satiety >= 80) {
            this.location.orb.supplimentNetwork.resources.addAll(this.storage.clear());
        }
    }

    override renderIcon(props: SpaceMinerGameClientCommonProps): ReactNode {
        return (
            <div className="PrimaryColonyFacility FacilityCommon">
                <div className="icon">
                    <div className="dome">
                        <div className="leaf"></div>
                    </div>
                </div>
            </div>
        );
    }

    // override renderStatus(props: SpaceMinerGameClientCommonProps): ReactNode {
    //     return (
    //         <div className="DrillWellFacility FacilityCommon">
    //             <div className="config">
    //                 <span className="config-item">当前效率：{toPercentString(this.efficiency)}</span>
    //             </div>
    //             <div>
    //                 <progress max={1} value={this.storage.satiety} />
    //             </div>
    //         </div>
    //     );
    // }

    override getDisplayedPairs(): Array<DisplayedPair> {
        return [
            ...super.getDisplayedPairs(),
            {
                key: new PlainText("内部存储"),
                value: new PlainText(`${shortenAsHumanReadable(this.storage.total)}/${shortenAsHumanReadable(this.storage.capacity)}`),
                progress: this.storage.satiety,
                style: { width: "20em" },
            },
        ];
    }

    // override getDisplayedProgresses(): [Text, number][] {
    //     return [
    //         [new PlainText("收获"), this.storage.satiety / 0.8],
    //     ];
    // }

    canCollect(item: ResourceItem): boolean {
        return item.resourceType.hardness <= 10;
    }
}