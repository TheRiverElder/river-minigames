import Text from "../../../libs/i18n/Text";
import { restoreText } from "../../../libs/i18n/TextRestorer";
import ListenerManager from "../../../libs/management/ListenerManager";
import SpaceMinerChannel, { CommandPack } from "./SpaceMinerChannel";

export default class UiChannel extends SpaceMinerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_DISPLAY_MESSAGE = "display_message";
    public static readonly COMMAND_DISPLAY_OVERLAY = "display_overlay";
    public static readonly COMMAND_DISPLAY_DIALOG = "display_dialog";

    public static readonly COMMAND_LEVEL_CHECKED = "level_checked";

    public readonly listeners = {
        MESSAGE: new ListenerManager<Text>(),
        OVERLAY: new ListenerManager<string>(),
        DIALOG: new ListenerManager<string>(),
    };

    get name(): string {
        return "ui";
    }

    sendSignalLevelChecked() {
        this.send({
            command: UiChannel.COMMAND_LEVEL_CHECKED,
        });
    }
    
    receive(pack: CommandPack): void {
        const { command, data } = pack;
        switch(command) {
            case UiChannel.COMMAND_DISPLAY_MESSAGE: this.listeners.MESSAGE.emit(restoreText(data)); break;
            case UiChannel.COMMAND_DISPLAY_OVERLAY: this.listeners.OVERLAY.emit(data); break;
            case UiChannel.COMMAND_DISPLAY_DIALOG: this.listeners.DIALOG.emit(data); break;
        }
    }

}