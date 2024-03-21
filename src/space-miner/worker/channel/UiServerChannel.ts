import Text from "../../../libs/i18n/Text";
import { CommandPack } from "../../client/channel/SpaceMinerChannel";
import SpaceMinerServerChannel from "./SpaceMinerServerChannel";

export default class UiChannel extends SpaceMinerServerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_DISPLAY_MESSAGE = "display_message";
    public static readonly COMMAND_DISPLAY_OVERLAY = "display_overlay";
    public static readonly COMMAND_DISPLAY_DIALOG = "display_dialog";

    public static readonly COMMAND_LEVEL_CHECKED = "level_checked";

    protected override onInitialize(): void {
        this.runtime.game.listeners.MESSAGE.add(this.sendSignalDisplayMessage.bind(this));
        this.runtime.game.listeners.OVERLAY.add(this.sendSignalDisplayOverlay.bind(this));
    }

    get name(): string {
        return "ui";
    }

    sendSignalDisplayMessage(text: Text) {
        this.send({
            command: UiChannel.COMMAND_DISPLAY_MESSAGE,
            data: text.getDisplayedModel(),
        });
    }

    sendSignalDisplayOverlay(name: string) {
        this.send({
            command: UiChannel.COMMAND_DISPLAY_OVERLAY,
            data: name,
        });
    }

    sendSignalDisplayDislog(name: string) {
        this.send({
            command: UiChannel.COMMAND_DISPLAY_DIALOG,
            data: name,
        });
    }
    
    receive(pack: CommandPack): void {
        const { command } = pack;
        switch(command) {
            case UiChannel.COMMAND_LEVEL_CHECKED: this.runtime.game.level.onChecked(); break;
        }
    }

}