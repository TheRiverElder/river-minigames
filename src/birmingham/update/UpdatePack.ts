import { int } from "../../libs/CommonTypes";

export default class UpdatePack {
    readonly uid: int;
    readonly data: any;

    constructor(uid: int, data: any) {
        this.uid = uid;
        this.data = data;
    }
} 