import { int } from "../../../libs/CommonTypes";
import Text from "../../../libs/i18n/Text";
import { restoreText } from "../../../libs/i18n/TextRestorer";
import ListenerManager from "../../../libs/management/ListenerManager";
import SpaceMinerChannel, { CommandPack } from "./SpaceMinerChannel";

export default class UiChannel extends SpaceMinerChannel<CommandPack, CommandPack> {

    public static readonly COMMAND_DISPLAY_MESSAGE = "display_message";
    public static readonly COMMAND_DISPLAY_OVERLAY = "display_overlay";
    public static readonly COMMAND_DISPLAY_DIALOG = "display_dialog";

    public static readonly COMMAND_LEVEL_CHECKED = "level_checked";

    public static readonly COMMAND_SCREEN_OPEN = "screen_open";
    public static readonly COMMAND_SCREEN_UPDATE = "screen_update";
    public static readonly COMMAND_SCREEN_CLOSE = "screen_close";

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

    sendSignalScreenUpdate(uid: int, pack: CommandPack) {
        this.send({
            command: UiChannel.COMMAND_SCREEN_UPDATE,
            data: [uid, pack],
        });
    }

    sendSignalScreenClose(uid: int) {
        this.send({
            command: UiChannel.COMMAND_SCREEN_CLOSE,
            data: uid,
        });
    }
    
    receive(pack: CommandPack): void {
        const { command, data } = pack;
        switch(command) {
            case UiChannel.COMMAND_DISPLAY_MESSAGE: this.listeners.MESSAGE.emit(restoreText(data)); break;
            case UiChannel.COMMAND_DISPLAY_OVERLAY: this.listeners.OVERLAY.emit(data); break;
            case UiChannel.COMMAND_DISPLAY_DIALOG: this.listeners.DIALOG.emit(data); break;
            case UiChannel.COMMAND_SCREEN_OPEN: {
                const [typeName, uid, payload] = data as [string, int | undefined, any | undefined];
            } break;
            case UiChannel.COMMAND_SCREEN_UPDATE: this.listeners.DIALOG.emit(data); break;
            case UiChannel.COMMAND_SCREEN_CLOSE: this.listeners.DIALOG.emit(data); break;
        }
    }

}