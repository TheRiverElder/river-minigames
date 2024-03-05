import { int } from "../../../libs/CommonTypes";
import ListenerManager from "../../../libs/management/ListenerManager";
import { GamerData, restoreGamer } from "../../simulator/user/Gamer";
import { restoreUser, UserData } from "../../simulator/user/User";
import Channel from "../../simulator/Channel";
import TableBottomSimulatorClient from "../../simulator/TableBottomSimulatorClient";

export default class GamePlayerChannel extends Channel {

    static readonly REQUEST_USERS = "request_users";
    static readonly UPDATE_USERS = "update_users";
    static readonly REQUEST_GAMERS = "request_gamers";
    static readonly UPDATE_GAMERS = "update_gamers";
    static readonly OCCUPY_GAMER = "occupy_gamer";

    public readonly listeners = {
        GAMERS_UPDATED: new ListenerManager(),
        USERS_UPDATED: new ListenerManager(),
    };

    constructor(simulator: TableBottomSimulatorClient) {
        super("game_player", simulator);
    }

    override receive(data: any) {
        const action: string = data.action;
        const commandData = data.data;
        switch (action) {
            case GamePlayerChannel.UPDATE_USERS: {
                const userDataList = commandData as Array<UserData>;
                for (const userData of userDataList) {
                    this.simulator.users.get(userData.uid)
                        .ifPresent(user => user.restore(userData))
                        .ifEmpty(() => this.simulator.users.add(restoreUser(userData, this.simulator)));
                }
                this.listeners.USERS_UPDATED.emit();
            } break;
            case GamePlayerChannel.UPDATE_GAMERS: {
                const gamerDataList = commandData as Array<GamerData>;
                for (const gamerData of gamerDataList) {
                    this.simulator.gamers.get(gamerData.uid)
                        .ifPresent(gamer => gamer.restore(gamerData))
                        .ifEmpty(() => this.simulator.gamers.add(restoreGamer(gamerData, this.simulator)));
                }
                this.listeners.GAMERS_UPDATED.emit();
            } break;
            default: throw new Error(`Unknown action: ${action}`);
        }
    }

    sendCommand(action: string, data: any = null) {
        this.send({ action, data });
    }

    sendRequestUsers() { this.sendCommand(GamePlayerChannel.REQUEST_USERS); }
    sendRequestGamers() { this.sendCommand(GamePlayerChannel.REQUEST_GAMERS); }
    sendRequestUsersAndGamers() {
        this.sendRequestUsers();
        this.sendRequestGamers();
    }
    sendOccupyGamer(gamerUid: int) { this.sendCommand(GamePlayerChannel.OCCUPY_GAMER, { gamerUid }); }

}
