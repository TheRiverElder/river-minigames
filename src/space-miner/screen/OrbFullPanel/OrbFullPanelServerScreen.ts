import { Pair, double, int } from "../../../libs/CommonTypes";
import { mapModel } from "../../../libs/io/Displayable";
import { ItemModel } from "../../model/item/Item";
import ResourceItem from "../../model/item/ResourceItem";
import { VIRTUAL_RESOURCE_TYPES } from "../../model/misc/ResourceTypes";
import GenericServerScreen, { GenericServerScreenProps, createGenericServerScreenType } from "../../worker/screen/GenericServerScreen";
import { OrbFullPanelCommon, OrbFullPanelModel } from "./OrbFullPanelCommon";

export interface OrbFullPanelServerScreenProps extends GenericServerScreenProps<OrbFullPanelServerScreen, { orbUid: int }> {

}

export default class OrbFullPanelServerScreen extends GenericServerScreen<OrbFullPanelServerScreen> {

    public static readonly TYPE = createGenericServerScreenType(OrbFullPanelCommon.ID, OrbFullPanelServerScreen);

    public readonly orbUid: int;

    constructor(props: OrbFullPanelServerScreenProps) {
        super(props);

        this.orbUid = props.payload.orbUid;
    }

    override setup(): void {
        super.setup();
        this.game.listeners.UI_UPDATE.add(this.onUiUpdate);
    }

    override dispose(): void {
        super.dispose();
        this.game.listeners.UI_UPDATE.remove(this.onUiUpdate);
    }

    private onUiUpdate = () => {
        this.updateClientUiData();  
    };

    override collectClientUiData(): OrbFullPanelModel {
        const orb = this.game.world.orbs.getOrThrow(this.orbUid);

        const specialResources: Array<Pair<string, double>> = [];
        const resources: Array<Pair<string, double>> = [];
        const otherItems: Array<ItemModel> = [];

        for (const item of [...orb.supplimentNetwork.nonPersistableResources.content, ...orb.supplimentNetwork.resources.content]) {
            if (item instanceof ResourceItem) {
                const resourceType = item.resourceType;
                if (VIRTUAL_RESOURCE_TYPES.includes(resourceType)) {
                    specialResources.push([resourceType.name, item.amount]);
                } else {
                    resources.push([resourceType.name, item.amount]);
                }
            } else {
                otherItems.push(item.getDisplayedModel());
            }
        }

        return {
            orbInfo: orb.getInfoModel(),
            specialResources,
            resources,
            otherItems,
            facilities: orb.facilities.map(mapModel),
        }
    }
}