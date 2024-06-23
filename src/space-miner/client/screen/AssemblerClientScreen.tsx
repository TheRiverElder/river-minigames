import { ComponentType } from "react";
import GenericClientScreen, { GenericClientScreenProps } from "./GenericClientScreen";
import { SpaceMinerClientCommonProps } from "../../ui/common";
import AssemblerView from "../../ui/tab/AssemblerView";
import { int } from "../../../libs/CommonTypes";
import { CreativeType } from "../../model/io/CreativeType";
import { AssemblingContextModel, RecipeModel } from "../../model/assemble/Recipe";
import React from "react";
import Optional from "../../../libs/lang/Optional";
import { AssemblerServerScreenModel } from "../../worker/screen/AssemblerServerScreen";
import ScreenCommands from "../../common/screen/ScreenCommands";
import { ClientScreenType } from "./ClientScreen";

export class AssemblerClientScreen extends GenericClientScreen<AssemblerClientScreen> {

    public static readonly TYPE: ClientScreenType<AssemblerClientScreen, { orbUid: int }> =
        new CreativeType("assembler", (type, gameApi, { uid, props, channel, payload }) => new AssemblerClientScreen({type, props, uid, channel, payload}))

    public readonly orbUid: int;

    constructor(
        props: GenericClientScreenProps<AssemblerClientScreen, {
            orbUid: int;
        }>,
    ) {
        super(props);
        this.orbUid = props.payload.orbUid;
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

    fetchRecipeResult(context: AssemblingContextModel): Promise<RecipeModel> {
        return this.channel.request(ScreenCommands.ASSEMBLER.GET_RECIPE_RESULT, context);
    }

    fetchScreenData(): Promise<AssemblerServerScreenModel> {
        return this.channel.request(ScreenCommands.ASSEMBLER.SCREEN_DATA);
    }

    assemble(context: AssemblingContextModel) {
        this.channel.send(ScreenCommands.ASSEMBLER.ASSEMBLE, context);
    }

    override receive(command: string, data?: any): any {

        switch (command) {
            case ScreenCommands.ASSEMBLER.GET_RECIPE_RESULT: {
                const recipeResult = data as RecipeModel;
                Optional.ofNullable(this.ref.current).ifPresent(node => {
                    node.setState({ recipeResult });
                });

            } break;
            case ScreenCommands.ASSEMBLER.SCREEN_DATA: {
                const screenData = data as AssemblerServerScreenModel;
                Optional.ofNullable(this.ref.current).ifPresent(node => {
                    node.setState({ screenData });
                });
            } break;
        }
    }

}