import { int, Pair } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import Game from "../global/Game";
import { CreativeType } from "../io/CreativeType";
import ResourceItem from "../item/ResourceItem";
import Collector from "../misc/Collector";
import Inventory from "../misc/storage/Inventory";
import Facility, { DisplayedOperation, DisplayedStatus, FacilityProps } from "./Facility";
// import "./FacilityCommon.scss";
// import "./ManualMineFacility.scss";
// import { DisplayedPair } from "../../ui/facility/GenericFacilityDetailView";
import ValueAnimator from "../../../libs/math/ValueAnimator";
import { SpaceMinerGameClientCommonProps } from "../../ui/common";
import PlainText from "../../../libs/i18n/PlainText";
import { shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import { filterNotEmpty } from "../../../libs/lang/Collections";

export default class ManualMineFacility extends Facility implements Collector {

    public static readonly TYPE = new CreativeType<Facility>("manual_mine", (type, game, data) => new ManualMineFacility({ type, game }));

    constructor(props: FacilityProps) {
        super(props);
        this.storage = new Inventory(100);
    }

    operated: boolean = false;
    readonly storage: Inventory;

    override preTick(game: Game): void {
        if (this.iconPropsOperatedAnimationCooldown > 0) this.iconPropsOperatedAnimationCooldown--;
    }

    override tick(game: Game): void {
        if (this.operated && this.location && !this.storage.full) {
            const resources = this.location.orb.onDrain(this, (200 * 2.5) / (20 * 60), this.location);
            this.storage.addAll(resources);
            this.valueAnimatorStorageTotal.update(this.storage.total);
        }
    }

    override postTick(game: Game): void {
        this.operated = false;
    }

    // override getTools(props: SpaceMinerGameClientCommonProps): Pair<Text, Function>[] {
    //     return [
    //         ...super.getTools(props),
    //         [
    //             new I18nText(`facility.common.tool.operate`),
    //             () => {
    //                 this.operated = true;
    //                 this.iconPropsOperatedAnimationCooldown = 30;
    //             },
    //         ],
    //         [
    //             new I18nText(`facility.common.tool.harvest`),
    //             () => {
    //                 this.location && this.location.orb.supplimentNetwork.resources.addAll(this.storage.clear());
    //                 this.valueAnimatorStorageTotal.update(this.storage.total);
    //             },
    //         ],
    //     ];
    // }

    canCollect(item: ResourceItem): boolean {
        return item.resourceType.hardness <= 10;
    }

    override getAcceptableOperationList(): Array<DisplayedOperation> {
        return filterNotEmpty([
            ...super.getAcceptableOperationList(),
            this.storage.full ? null : { key: "operate" },
            this.storage.empty ? null : { key: "harvest" },
        ]);
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

    private iconPropsOperatedAnimationCooldown: int = 0;

    // override renderIcon(props: SpaceMinerGameClientCommonProps): ReactNode {
    //     return (
    //         <div className="ManualMineFacility">
    //             <div className={classNames("icon", { operated: this.iconPropsOperatedAnimationCooldown > 0 })}>
    //                 <div className="ground" />
    //                 <div className="hammer" />
    //             </div>
    //         </div>
    //     );
    // }

    override getStatusList(): Array<DisplayedStatus> {
        return [
            ...super.getStatusList(),
            {
                name: new PlainText("内部存储").getDisplayedModel(),
                value: new PlainText(`${shortenAsHumanReadable(this.storage.total)}/${shortenAsHumanReadable(this.storage.capacity)} U.`).getDisplayedModel(),
                progress: this.storage.satiety,
                width: 16,
            },
        ];
    }

    private readonly valueAnimatorStorageTotal = new ValueAnimator({
        duration: 500,
        initialValue: 0,
        renderer: (frame, start, end) => start + frame * (end - start),
    });

}