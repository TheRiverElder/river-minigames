import Channel from "../../simulator/Channel";
import TableBottomSimulatorClient from "../../simulator/TableBottomSimulatorClient";
import GameObject from "../../simulator/gameobject/GameObject";
import User from "../../simulator/user/User";

export default class FullUpdateChannal extends Channel {

    constructor(simulator: TableBottomSimulatorClient) {
        super("full_update", simulator);
    }

    override receive(data: any): void {
        // for (const gamerData of data.gamers) {
        //     const gamer = new Gamer(gamerData.name, gamerData.color);
        //     this.simulator.gamers.add(gamer);
        // }
        for (const userData of data.users) {
            const user = new User(this.simulator, userData.uid);
            this.simulator.users.add(user);
        }
        for (const gameObjectData of data.gameObjects) {
            const gameObject = new GameObject(this.simulator, gameObjectData.uid);
            gameObject.restore(gameObjectData);
            this.simulator.gameObjects.add(gameObject);
        }
        this.simulator.onWholeUiUpdateListeners.emit();
        // console.log(this.simulator.onWholeUiUpdateListeners);
    }

}