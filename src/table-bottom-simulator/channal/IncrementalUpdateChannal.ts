import { int } from "../../libs/CommonTypes";
import Channal from "./Channel";

export default class IncrementalUpdateChannal extends Channal {
    
    receive(data: any): void {
        for(const userData of (data.users || [])) {
            const uid: int = userData.uid;
            this.simulator.users.get(uid)
                .ifPresent(user => user.receiveUpdatePack(userData));
        }
        for(const gameObjectData of (data.gameObjects || [])) {
            const uid: int = gameObjectData.uid;
            this.simulator.gameObjects.get(uid)
                .ifPresent(gameObject => {
                    gameObject.receiveUpdatePack(gameObjectData);
                    gameObject.onUiUpdate.emit();
                });
        }
    }

}