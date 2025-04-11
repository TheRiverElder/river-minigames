import PlainText from "../../../libs/i18n/PlainText";
import { repeatRun, shortenAsHumanReadable } from "../../../libs/lang/Extensions";
import Game from "../global/Game";
import { CreativeType } from "../io/CreativeType";
import Facility, { DisplayedStatus } from "./Facility";

export default class HumanResourceFacility extends Facility {

    public static readonly TYPE = new CreativeType<Facility>("human_resource_facility", (type, game, data) => new HumanResourceFacility({ type, game }));

    public speed = 1; // clicks per tick

    // 一个tick内剩余不到1次的操作。粗存起来，等超过1的时候再执行
    private unusedOperations = 0;

    override preTick(game: Game): void {
        let operationsToRun = Math.floor(this.speed);
        
        this.unusedOperations += (this.speed - operationsToRun);
        if (this.unusedOperations >= 1) {
            operationsToRun += Math.floor(this.unusedOperations);
            this.unusedOperations -= this.unusedOperations % 1;
        }

        // 执行操作
        this.location?.orb.facilities.forEach(facility => {
            repeatRun(() => {
                facility.acceptOperation("operate");
            }, operationsToRun);
        });
    }

    override getStatusList(): DisplayedStatus[] {
        return [
            {
                name: new PlainText("速度").getDisplayedModel(),
                value: new PlainText(shortenAsHumanReadable(this.speed) + " c/t").getDisplayedModel(),
            },
        ];
    }
}