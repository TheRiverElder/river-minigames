import { int } from "../../libs/CommonTypes";
import Optional from "../../libs/lang/Optional";
import BehaviorPoinerListener from "../builtin/behavior/BehaviorPoinerListener";
import { Side } from "../gameobject/Behavior";
import TableBottomSimulator from "../TableBottomSimulator";
import User from "../user/User";

export default class TableBottomSimulatorCommon extends TableBottomSimulator {
    
    get side(): Side {
        return Side.COMMON;
    }

    readonly userUid: int;
    user!: User;

    constructor(userAmount: int) {
        super();
        for (let i = 0; i < userAmount; i++) {
            const user = new User(this, this.uidGenerator.generate());
            this.users.add(user);
        }
        this.userUid = this.users.values()[0].uid;
    }

    sendRowDataToServer(data: string): void {
        this.reveiveRowDataFromClient(data, this.user);
    }
    
    sendRowDataToClient(data: string, rceiver: User): void {
        if (rceiver === this.user) {
            this.reveiveRowDataFromServer(data);
        }
    }

    reveiveRowDataFromServer(data: any): void {
        super.reveiveRowDataFromServer(data);
        Optional.ofNullable<BehaviorPoinerListener>(this.root.behaviors.getBehavior(BehaviorPoinerListener))
            .ifPresent(b => b.onUiUpdate.emit());
    }

}
