import { int } from "../../libs/CommonTypes";
import GameObject from "../gameobject/GameObject";
import User from "../user/User";
import Channal from "./Channel";

export default class IncrementalUpdateChannal extends Channal {
    
    receive(data: any): void {
        for(const userData of (data.users || [])) {
            const uid: int = userData.uid;
            this.simulator.users.get(uid)
                .ifPresent(user => user.receiveUpdatePack(userData))
                .ifEmpty(() => {
                    const user = new User(this.simulator, uid);
                    user.restore(userData);
                    this.simulator.users.add(user);
                });
        }
        let needSimulatorUiUpdate: boolean = false;
        for(const gameObjectData of (data.gameObjects || [])) {
            const uid: int = gameObjectData.uid;
            this.simulator.gameObjects.get(uid)
                .ifPresent(gameObject => {
                    gameObject.receiveUpdatePack(gameObjectData);
                    gameObject.onUiUpdate.emit();
                }).ifEmpty(() => {
                    const gameObject = new GameObject(this.simulator, uid);
                    gameObject.restore(gameObjectData);
                    this.simulator.gameObjects.add(gameObject);
                    needSimulatorUiUpdate = true;
                });
        }
        if (needSimulatorUiUpdate) {
            this.simulator.onWholeUiUpdate.emit();
        }
    }

}