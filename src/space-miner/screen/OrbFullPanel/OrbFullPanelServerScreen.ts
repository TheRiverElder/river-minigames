import { int } from "../../../libs/CommonTypes";
import { OrbModel } from "../../model/orb/Orb";
import GenericServerScreen, { GenericServerScreenProps } from "../../worker/screen/GenericServerScreen";

export interface OrbFullPanelServerScreenProps extends GenericServerScreenProps<OrbFullPanelServerScreen, { orbUid: int }> {
    
}

export default class OrbFullPanelServerScreen extends GenericServerScreen<OrbFullPanelServerScreen> {

    public readonly orbUid: int;
    
    constructor(props: OrbFullPanelServerScreenProps) {
        super(props);

        this.orbUid = props.payload.orbUid;
    }

    override collectClientUiData(): OrbModel {
        const orb = this.game.world.orbs.getOrThrow(this.orbUid);
        return orb.getDisplayedModel();
    }
}