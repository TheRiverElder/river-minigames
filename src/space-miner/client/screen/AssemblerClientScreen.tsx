import { ComponentType } from "react";
import { CommandPack } from "../channel/SpaceMinerChannel";
import GenericClientScreen from "../../screen/GenericClientScreen";
import { SpaceMinerClientCommonProps, SpaceMinerGameClientCommonProps } from "../../ui/common";
import AssemblerView from "../../ui/tab/AssemblerView";
import { ClientScreenType } from "../../screen/ClientScreen";
import { int } from "../../../libs/CommonTypes";
import { CreativeType } from "../../model/io/CreativeType";

export class AssemblerClientScreen extends GenericClientScreen {

    public static readonly TYPE: ClientScreenType<AssemblerClientScreen, { orbUid: int }> =
        new CreativeType("assembler", ({ type }, { uid, props, payload }) => new AssemblerClientScreen(type, props, uid, payload))

    public readonly orbUid: int;

    constructor(
        type: ClientScreenType,
        props: SpaceMinerGameClientCommonProps,
        uid: int,
        payload: { orbUid: int },
    ) {
        super(type, props, uid);
        this.orbUid = payload.orbUid;
    }


    override getComponentProvider(): ComponentType<SpaceMinerClientCommonProps> {
        return (props) => (
            <AssemblerView
                {...this.props}
                {...props}
                gameApi={this.gameApi}
                orbUid={this.orbUid}
            />
        )
    }

    override receive(pack: CommandPack<any>): void {
        throw new Error("Method not implemented.");
    }

}