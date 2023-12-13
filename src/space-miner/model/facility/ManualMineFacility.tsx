import { ReactNode } from "react";
import { double, Pair } from "../../../libs/CommonTypes";
import I18nText from "../../../libs/i18n/I18nText";
import Text from "../../../libs/i18n/Text";
import { shortenAsHumanReadable, toPercentString } from "../../../libs/lang/Extensions";
import Game from "../../Game";
import SpaceMinerUICommonProps from "../../ui/SpaceMinerUICommonProps";
import { CreativeType } from "../io/CreativeType";
import ResourceItem from "../item/ResourceItem";
import Collector from "../misc/Collector";
import Inventory from "../misc/storage/Inventory";
import Facility from "./Facility";
import "./FacilityCommon.scss";

export default class ManualMineFacility extends Facility implements Collector {

    public static readonly TYPE = new CreativeType("manual_mine", (game, data) => new ManualMineFacility(game));
    override get type() { return ManualMineFacility.TYPE; }

    constructor(game: Game, efficiency: double = 1.0) {
        super(game, efficiency);
        this.name = "manual_mine";
        this.storage = new Inventory(100);
    }

    operated: boolean = false;
    readonly storage: Inventory;

    override tick(game: Game): void {
        if (this.operated && this.location) {
            const resources = this.location.orb.onDrain(this, (200 * 2.5) / (20 * 60), this.location);
            this.storage.addAll(resources);
        }
    }
    
    override postTick(game: Game): void {
        this.operated = false;
    }

    override getTools(props: SpaceMinerUICommonProps): Pair<Text, Function>[] {
        return [
            ...super.getTools(props),
            [
                new I18nText(`facility.${this.name}.tool.operate`),
                () => this.operated = true,
            ],
            [
                new I18nText(`facility.${this.name}.tool.harvest`),
                () => this.location && this.location.orb.supplimentNetwork.resources.addAll(this.storage.clear()),
            ],
        ];
    }

    canCollect(item: ResourceItem): boolean {
        return item.resourceType.hardness <= 10;
    }

    override renderStatus(props: SpaceMinerUICommonProps): ReactNode {
        return (
            <div className="ManualMineFacility FacilityCommon">
                <div className="config">
                    <span className="config-item">当前效率：{toPercentString(this.efficiency)}</span>
                    <span className="config-item">库存：{shortenAsHumanReadable(this.storage.total)}/{shortenAsHumanReadable(this.storage.capacity)}</span>
                </div>
            </div>
        )
    }

}