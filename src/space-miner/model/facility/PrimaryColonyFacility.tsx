import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Game from "../global/Game";
import Facility, { DisplayedOperation, DisplayedStatus } from "./Facility";
// import "./FacilityCommon.scss";
// import "./PrimaryColonyFacility.scss";
import ResourceItem from "../item/ResourceItem";
import Collector from "../misc/Collector";
import { CreativeType } from "../io/CreativeType";
import Inventory from "../misc/storage/Inventory";
import PlainText from "../../../libs/i18n/PlainText";
// import { DisplayedPair } from "../../ui/facility/GenericFacilityDetailView";
import ValueAnimator from "../../../libs/math/ValueAnimator";

export default class PrimaryColonyFacility extends Facility implements Collector {

    public static readonly TYPE = new CreativeType<Facility>("primary_colony", (type, game, data) => new PrimaryColonyFacility({ type, game }));

    operated: boolean = false;
    readonly storage: Inventory = new Inventory(100);

    protected cachedElectricity = 0;
    protected cachedLiveSupport = 0;

    override tick(game: Game): void {
        if (!this.location || this.efficiency <= 0) return;

        if (this.storage.satiety >= 0.80) {
            this.location.orb.supplimentNetwork.resources.addAll(this.storage.clear());
        }

        // 自动采矿作业，每分钟能采集的资源数量（现事时间，准确说是20 * 60个游戏刻）
        const resourceOutpoputPerMinute = 200;
        // 手动采集作业相对于自动采集的资源倍数
        const manualOperationAmplifier = 8.0;

        const electricity = 200 / (20 * 60) * this.efficiency;
        const liveSupport = 5 / (20 * 60) * this.efficiency;
        this.cachedElectricity = electricity;
        this.cachedLiveSupport = liveSupport;

        this.location.orb.supplimentNetwork.supplyElectricity(electricity, this);
        this.location.orb.supplimentNetwork.supplyLiveSupport(liveSupport, this);

        const resources = this.location.orb.onDrain(this, resourceOutpoputPerMinute / (20 * 60) * this.efficiency, this.location);
        if (this.operated) {
            resources.push(...this.location.orb.onDrain(this, (resourceOutpoputPerMinute * manualOperationAmplifier) / (20 * 60), this.location));
            this.valueAnimatorStorageTotal.update(this.storage.total);
        }
        this.storage.addAll(resources);
    }

    override postTick(game: Game): void {
        this.operated = false;
    }


    private readonly valueAnimatorStorageTotal = new ValueAnimator({
        duration: 500,
        initialValue: 0,
        renderer: (frame, start, end) => start + frame * (end - start),
    });

    override getAcceptableOperationList(): Array<DisplayedOperation> {
        return [
            ...super.getAcceptableOperationList(),
            { key: "operate" },
            { key: "harvest" },
        ];
    }

    override acceptOperation(key: string): void {
        switch (key) {
            case "operate": {
                this.operated = true
            } break;
            case "harvest": {
                this.location && this.location.orb.supplimentNetwork.resources.addAll(this.storage.clear());
                this.valueAnimatorStorageTotal.update(this.storage.total);
            } break;
        }
    }

    // override renderIcon(props: SpaceMinerGameClientCommonProps): ReactNode {
    //     return (
    //         <div className="PrimaryColonyFacility FacilityCommon">
    //             <div className="icon">
    //                 <div className="dome">
    //                     <div className="leaf"></div>
    //                 </div>
    //             </div>
    //         </div>
    //     );
    // }

    getStatusList(): Array<DisplayedStatus> {
        return [
            ...super.getStatusList(),
            {
                name: new PlainText("内部存储").getDisplayedModel(),
                value: new PlainText(`${shortenAsHumanReadable(this.storage.total)}/${shortenAsHumanReadable(this.storage.capacity)} U.`).getDisplayedModel(),
                progress: this.storage.satiety,
                width: 16,
            },
            {
                name: new PlainText("产电").getDisplayedModel(),
                value: new PlainText(`${shortenAsHumanReadable(this.cachedElectricity)}`).getDisplayedModel(),
            },
            {
                name: new PlainText("维生").getDisplayedModel(),
                value: new PlainText(`${shortenAsHumanReadable(this.cachedLiveSupport)}`).getDisplayedModel(),
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