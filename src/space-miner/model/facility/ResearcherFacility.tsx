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
import { clamp } from "lodash";

export default class ResearcherFacility extends Facility {

    public static readonly TYPE = new CreativeType<Facility>("researcher", (type, game, data) => new ResearcherFacility({ type, game }));

    protected cachedTechPoints = 0;

    override tick(game: Game): void {
        const location = this.location;
        if (!location) return;

        // 耗电
        const totalElectricity = 50 / (20 * 60);
        const consumedElectricity = location.orb.supplimentNetwork.requireElectricity(totalElectricity, this);
        if (consumedElectricity <= 0) return;
        const efficiency = clamp(consumedElectricity / totalElectricity, 0, 1);
        
        const techPoints = efficiency * (200 / (20 * 60));
        this.cachedTechPoints = techPoints;
        game.profile.techPoints += techPoints;
    }

    // override getAcceptableOperationList(): Array<DisplayedOperation> {
    //     return [
    //         ...super.getAcceptableOperationList(),
    //         { key: "operate" },
    //         { key: "harvest" },
    //     ];
    // }

    // override acceptOperation(key: string): void {
    //     switch (key) {
    //         case "operate": {
    //             this.operated = true
    //         } break;
    //         case "harvest": {
    //             this.location && this.location.orb.supplimentNetwork.resources.addAll(this.storage.clear());
    //             this.valueAnimatorStorageTotal.update(this.storage.total);
    //         } break;
    //     }
    // }

    getStatusList(): Array<DisplayedStatus> {
        return [
            ...super.getStatusList(),
            {
                name: new PlainText("产出").getDisplayedModel(),
                value: new PlainText(`${shortenAsHumanReadable(this.cachedTechPoints * (20 * 60))} U/m`).getDisplayedModel(),
                width: 10,
            },
        ];
    }
}