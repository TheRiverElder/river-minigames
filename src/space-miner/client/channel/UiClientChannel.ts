import { Supplier, int } from "../../../libs/CommonTypes";
import Text from "../../../libs/i18n/Text";
import { restoreText } from "../../../libs/i18n/TextRestorer";
import ListenerManager from "../../../libs/management/ListenerManager";
import { Channel } from "../../common/channel/Channel";
import { ChannelDataSender } from "../../common/channel/ChannelDataSender";
import Commands from "../../common/channel/Commands";
import ScreenChannel from "../../common/screen/ScreenChannel";
import { SpaceMinerGameClientCommonProps } from "../../ui/common";
import ClientScreen, { ClientScreenType } from "../screen/ClientScreen";
import ClientChannel from "./ClientChannel";

export default class UiClientChannel extends ClientChannel implements ChannelDataSender<ScreenChannel> {

    public readonly listeners = {
        MESSAGE: new ListenerManager<Text>(),
        OVERLAY: new ListenerManager<string>(),
        DIALOG: new ListenerManager<string>(),
    };

    public propsGetter: Supplier<SpaceMinerGameClientCommonProps> | null = null;

    get name(): string {
        return "ui";
    }

    notifyLevelChecked() {
        this.send(Commands.UI.COMMAND_LEVEL_CHECKED);
    }

    sendScreenOpen(typeName: string, payload: any) {
        this.send(Commands.UI.COMMAND_SCREEN_OPEN, [typeName, payload]);
    }

    sendScreenUpdate(uid: int, pack: any) {
        this.send(Commands.UI.COMMAND_SCREEN_UPDATE, [uid, pack]);
    }

    sendScreenClose(uid: int) {
        this.send(Commands.UI.COMMAND_SCREEN_CLOSE, uid);
    }

    openScreen<TScreen extends ClientScreen, TPayload>(type: ClientScreenType<TScreen, TPayload>, payload: TPayload) {
        this.sendScreenOpen(type.id, payload);
    }

    override receive(command: string, data?: any): void {
        switch (command) {
            case Commands.UI.COMMAND_DISPLAY_MESSAGE: this.listeners.MESSAGE.emit(restoreText(data)); break;
            case Commands.UI.COMMAND_DISPLAY_OVERLAY: this.listeners.OVERLAY.emit(data); break;
            case Commands.UI.COMMAND_DISPLAY_DIALOG: this.listeners.DIALOG.emit(data); break;
            case Commands.UI.COMMAND_SCREEN_OPEN: {
                const [typeName, uid, payload] = data as [string, int, any];
                const props = this.propsGetter();
                const channel = new ScreenChannel(this, uid);
                const screen = this.gameApi.screenTypes.getOrThrow(typeName).create(this.gameApi, { uid, props, channel, payload });
                screen.open();
            } break;
            case Commands.UI.COMMAND_SCREEN_UPDATE: {
                const [uid, { command, data: d, id }] = data as [int, { command?: string, data?: any, id?: int }];
                this.gameApi.screens.get(uid).ifPresent(screen => {
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
                this.gameApi.screens.get(uid).ifPresent(screen => screen.close());
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

