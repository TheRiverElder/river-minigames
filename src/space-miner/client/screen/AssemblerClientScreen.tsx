import { ComponentType } from "react";
import { CommandPack } from "../channel/SpaceMinerChannel";
import GenericClientScreen from "../../screen/GenericClientScreen";
import { SpaceMinerClientCommonProps, SpaceMinerGameClientCommonProps } from "../../ui/common";
import AssemblerView from "../../ui/tab/AssemblerView";
import { ClientScreenType } from "../../screen/ClientScreen";
import { int } from "../../../libs/CommonTypes";
import { CreativeType } from "../../model/io/CreativeType";
import { AssemblingContextModel, RecipeModel } from "../../model/assemble/Recipe";
import React from "react";
import Optional from "../../../libs/lang/Optional";
import { AssemblerServerScreenModel } from "../../worker/screen/AssemblerServerScreen";

export class AssemblerClientScreen extends GenericClientScreen {

    public static readonly COMMAND_RECIPE_RESULT = "recipe_result";
    public static readonly COMMAND_SCREEN_DATA = "screen_data";
    public static readonly COMMAND_ASSEMBLE = "assemble";

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

    private ref = React.createRef<AssemblerView>();


    override getComponentProvider(): ComponentType<SpaceMinerClientCommonProps> {
        return (props) => (
            <AssemblerView
                {...this.props}
                {...props}
                screen={this}
                ref={this.ref}
                gameApi={this.gameApi}
                orbUid={this.orbUid}
            />
        );
    }

    sendSignalRecipeResult(context: AssemblingContextModel) {
        this.send({
            command: AssemblerClientScreen.COMMAND_RECIPE_RESULT,
            data: context,
        });
    }

    sendSignalScreenData() {
        this.send({
            command: AssemblerClientScreen.COMMAND_SCREEN_DATA,
        });
    }

    sendSignalAssemble(context: AssemblingContextModel) {
        this.send({
            command: AssemblerClientScreen.COMMAND_ASSEMBLE,
            data: context,
        });
    }

    override receive(pack: CommandPack<any>): void {
        const { command, data } = pack;

        switch (command) {
            case AssemblerClientScreen.COMMAND_RECIPE_RESULT: {
                const recipeResult = data as RecipeModel;
                Optional.ofNullable(this.ref.current).ifPresent(node => {
                    node.setState({ recipeResult });
                });

            } break;
            case AssemblerClientScreen.COMMAND_SCREEN_DATA: {
                const screenData = data as AssemblerServerScreenModel;
                Optional.ofNullable(this.ref.current).ifPresent(node => {
                    node.setState({ screenData });
                });
            } break;
        }
    }

}