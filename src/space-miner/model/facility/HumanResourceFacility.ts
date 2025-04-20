import { int } from "../../../libs/CommonTypes";
import PlainText from "../../../libs/i18n/PlainText";
import { repeatRun, shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Game from "../global/Game";
import { CreativeType } from "../io/CreativeType";
import Orb from "../orb/Orb";
import Facility, { DisplayedStatus } from "./Facility";

export default class HumanResourceFacility extends Facility {

    public static readonly TYPE = new CreativeType<Facility>("human_resource_facility", (type, game, data) => new HumanResourceFacility({ type, game }));

    public speed = 1; // clicks per tick

    // 一个tick内剩余不到1次的操作，存起来，等超过1的时候再执行
    private unusedOperations = 0;

    // 作用于这些设施
    private choosenFacilities: int[] = [];

    override preTick(game: Game): void {
        let operationsToRun = Math.floor(this.speed);

        this.unusedOperations += (this.speed - operationsToRun);
        if (this.unusedOperations >= 1) {
            operationsToRun += Math.floor(this.unusedOperations);
            this.unusedOperations -= this.unusedOperations % 1;
        }

        // 执行操作
        const orb = this.location?.orb;
        if (!orb) return;

        this.getTargetFacilities(orb)
            .forEach(facility => {
                repeatRun(() => facility.acceptOperation("operate"), operationsToRun);
            });
    }

    private getTargetFacilities(orb: Orb) {
        return orb.facilities;
        // return orb.facilities.filter(facility => this.choosenFacilities.includes(facility.id));
    }

    override getStatusList(): DisplayedStatus[] {
        return [
            {
                name: new PlainText("速度").getDisplayedModel(),
                value: new PlainText(shortenAsHumanReadable(this.speed) + " op/t").getDisplayedModel(),
            },
        ];
    }
}