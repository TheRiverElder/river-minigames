import { ReactNode } from "react";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import Facility from "./Facility";
import "./FacilityCommon.scss";
import "./PrimaryColonyFacility.scss";
import SpaceMinerGameClientCommonProps from "../../ui/common";
import ResourceItem from "../item/ResourceItem";
import Collector from "../misc/Collector";
import { CreativeType } from "../io/CreativeType";
import Inventory from "../misc/storage/Inventory";
import PlainText from "../../../libs/i18n/PlainText";
import { DisplayedPair } from "../../ui/facility/GenericFacilityDetailView";
import { Pair } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import ValueAnimator from "../../../libs/math/ValueAnimator";
import Text from "../../../libs/i18n/Text";

export default class PrimaryColonyFacility extends Facility implements Collector {

    public static readonly TYPE = new CreativeType<Facility>("primary_colony", (game, data) => new PrimaryColonyFacility(game));

    readonly storage: Inventory = new Inventory(100);

    protected cachedElectricity = 0;
    protected cachedLiveSupport = 0;

    override tick(game: Game): void {
        if (!this.location || this.efficiency <= 0) return;

        if (this.storage.satiety >= 0.80) {
            this.location.orb.supplimentNetwork.resources.addAll(this.storage.clear());
        }

        const electricity = 200 / (20 * 60) * this.efficiency;
        const liveSupport = 5 / (20 * 60) * this.efficiency;
        this.cachedElectricity = electricity;
        this.cachedLiveSupport = liveSupport;

        this.location.orb.supplimentNetwork.supplyElectricity(electricity, this);
        this.location.orb.supplimentNetwork.supplyLiveSupport(liveSupport, this);

        const resources = this.location.orb.onDrain(this, 10 / (20 * 60) * this.efficiency, this.location);
        this.storage.addAll(resources);
    }
    

    private readonly valueAnimatorStorageTotal = new ValueAnimator({
        duration: 500,
        initialValue: 0,
        renderer: (frame, start, end) => start + frame * (end - start),
    });

    override getTools(props: SpaceMinerGameClientCommonProps): Pair<Text, Function>[] {
        return [
            ...super.getTools(props),
            [
                new I18nText(`facility.common.tool.harvest`),
                () => {
                    this.location && this.location.orb.supplimentNetwork.resources.addAll(this.storage.clear());
                    this.valueAnimatorStorageTotal.update(this.storage.total);
                },
            ],
        ];
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

    override getDisplayedPairs(): Array<DisplayedPair> {
        return [
            ...super.getDisplayedPairs(),
            {
                key: new PlainText("内部存储"),
                value: new PlainText(`${shortenAsHumanReadable(this.storage.total)}/${shortenAsHumanReadable(this.storage.capacity)} U.`),
                progress: this.storage.satiety,
                style: { width: "20em" },
            },
            {
                key: new PlainText("产电"),
                value: new PlainText(`${shortenAsHumanReadable(this.cachedElectricity)}`),
            },
            {
                key: new PlainText("维生"),
                value: new PlainText(`${shortenAsHumanReadable(this.cachedLiveSupport)}`),
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