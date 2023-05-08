import { int } from "../../libs/CommonTypes";
import User from "../user/User";

export default class BirminghamPlayer {
    income: int = 0;
    account: int = 0;
    score: int = 0;
    cost: int = 0; // 记录回合花的钱
    
    readonly user: User;

    constructor(user: User) {
        this.user = user;
    }
}