import { int } from "../../../libs/CommonTypes";
import Text from "../../../libs/i18n/Text";
import { ChannelDataSender } from "../../common/channel/ChannelDataSender";
import Commands from "../../common/channel/Commands";
import ScreenChannel from "../../common/screen/ScreenChannel";
import ServerChannel from "./ServerChannel";

export default class UiServerChannel extends ServerChannel implements ChannelDataSender<ScreenChannel> {

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

    override receive(command: string, data?: any): void {console.log(arguments)
        switch (command) {
            case Commands.UI.COMMAND_LEVEL_CHECKED: this.runtime.game.level.onChecked(); break;
            case Commands.UI.COMMAND_SCREEN_OPEN: {
                const [typeId, payload] = data as [string, any];
                this.runtime.screenManager.openByTypeId(typeId, this.runtime, payload);
            } break;
            case Commands.UI.COMMAND_SCREEN_UPDATE: {
                const [uid, { command, data: d, id }] = data as [int, { command?: string, data?: any, id?: int }];
                this.runtime.screenManager.screens.get(uid).ifPresent(screen => {
                    if (typeof id === 'number') {
                        if (typeof command === 'string') {
                            const responseData = screen.channel.response(command, d);
                            this.send(Commands.UI.COMMAND_SCREEN_UPDATE, [uid, { id, data: responseData }])
                        } else {
                            screen.channel.receiveResponse(id, d);
                        }
                    } else {
                        screen.channel.receive(command!, d)
                    }
                });
            } break;
            case Commands.UI.COMMAND_SCREEN_CLOSE: {
                const uid = data as int;
                this.runtime.screenManager.screens.get(uid).ifPresent(screen => screen.close());
            } break;
        }
    }

    sendData(channel: ScreenChannel, command: string, data?: any): void {
        this.sender.sendData(this, Commands.UI.COMMAND_SCREEN_UPDATE, [channel.screenUid, {
            command,
            data,
        }]);
    }

    sendRequest(channel: ScreenChannel, id: number, command: string, data?: any): void {
        this.sender.sendData(this, Commands.UI.COMMAND_SCREEN_UPDATE, [channel.screenUid, {
            command,
            id,
            data,
        }]);
    }

}