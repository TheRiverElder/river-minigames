import { int } from "../../../libs/CommonTypes";
import Text from "../../../libs/i18n/Text";
import Commands from "../../common/channel/Commands";
import ServerChannel from "./ServerChannel";

export default class UiServerChannel extends ServerChannel {

    protected override onInitialize(): void {
        this.runtime.game.listeners.MESSAGE.add(this.sendlDisplayMessage.bind(this));
        this.runtime.game.listeners.OVERLAY.add(this.sendDisplayOverlay.bind(this));
    }

    get name(): string {
        return "ui";
    }

    notifyScreenOpen(typeName: string, uid: int, payload?: any) {
        this.send(Commands.UI.COMMAND_SCREEN_OPEN, [typeName, uid, payload]);
    }

    sendScreenClose(uid: int) {
        this.send(Commands.UI.COMMAND_SCREEN_CLOSE, uid);
    }

    sendScreenUpdate(uid: int, pack: any) {
        this.send(Commands.UI.COMMAND_SCREEN_UPDATE, [uid, pack]);
    }

    sendlDisplayMessage(text: Text) {
        this.send(Commands.UI.COMMAND_DISPLAY_MESSAGE, text.getDisplayedModel());
    }

    sendDisplayOverlay(name: string) {
        this.send(Commands.UI.COMMAND_DISPLAY_OVERLAY, name);
    }

    sendDisplayDialog(name: string) {
        this.send(Commands.UI.COMMAND_DISPLAY_DIALOG,
            name);
    }

    override receive(command: string, data?: any): void {
        switch (command) {
            case Commands.UI.COMMAND_LEVEL_CHECKED: this.runtime.game.level.onChecked(); break;
            case Commands.UI.COMMAND_SCREEN_OPEN: {
                const [typeName, payload] = data as [string, any];
                const screen = this.runtime.screenTypes.getOrThrow(typeName).create(this.runtime,
                    { profile: this.runtime.game.profile, payload });
                screen.open();
            } break;
            case Commands.UI.COMMAND_SCREEN_UPDATE: {
                const [uid, d] = data as [int, any];
                this.runtime.screens.get(uid).ifPresent(screen => screen.receive(d));
            } break;
            case Commands.UI.COMMAND_SCREEN_CLOSE: {
                const uid = data as int;
                this.runtime.screens.get(uid).ifPresent(screen => screen.close());
            } break;
        }
    }

}