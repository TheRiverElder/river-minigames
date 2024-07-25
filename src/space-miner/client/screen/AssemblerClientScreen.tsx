import { ComponentType } from "react";
import GenericClientScreen, { GenericClientScreenProps } from "./GenericClientScreen";
import { SpaceMinerClientCommonProps } from "../../ui/common";
import AssemblerView from "../../ui/tab/AssemblerView";
import { int } from "../../../libs/CommonTypes";
import { CreativeType } from "../../model/io/CreativeType";
import { AssemblingContextItemModel } from "../../model/assemble/Recipe";
import React from "react";
import { AssemblerServerScreenModel } from "../../worker/screen/AssemblerServerScreen";
import ScreenCommands from "../../common/screen/ScreenCommands";
import { ClientScreenType } from "./ClientScreen";
import { AssemblerTaskModel } from "../../model/assemble/Assembler";

export class AssemblerClientScreen extends GenericClientScreen<AssemblerClientScreen> {

    public static readonly TYPE: ClientScreenType<AssemblerClientScreen, { orbUid: int }> =
        new CreativeType("assembler", (type, gameApi, { uid, props, channel, payload }) => new AssemblerClientScreen({ type, props, uid, channel, payload }))

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

    fetchAssemblerTasks(): Promise<Array<AssemblerTaskModel>> {
        return this.channel.request(ScreenCommands.ASSEMBLER.GET_ASSEMBLER_TASKS);
    }

    setRecipe(recipeName: string): Promise<void> {
        return this.channel.request(ScreenCommands.ASSEMBLER.SET_RECIPE, recipeName);
    }

    clearMaterials(): Promise<void> {
        return this.channel.request(ScreenCommands.ASSEMBLER.CLEAR_MATERIALS);
    }

    setMaterial(material: AssemblingContextItemModel): Promise<void> {
        return this.channel.request(ScreenCommands.ASSEMBLER.SET_MATERIAL, material);
    }

    autoFill(): Promise<void> {
        return this.channel.request(ScreenCommands.ASSEMBLER.AUTO_FILL);
    }

    assemble(): Promise<void> {
        return this.channel.request(ScreenCommands.ASSEMBLER.ASSEMBLE);
    }

    override onUpdateClientUiData(data: AssemblerServerScreenModel = {}): void {
        this.ref.current?.setState(s => ({
            cachedItems: data?.cachedItems ?? s.cachedItems,
            recipeResult: data?.recipe ?? s.recipeResult,
            selectedMaterials: data?.materials ?? s.selectedMaterials,
        }));
    }

}