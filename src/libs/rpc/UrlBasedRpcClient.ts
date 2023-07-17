import axios from "axios";
import { Productor } from "../CommonTypes";
import RpcClient from "./RpcClient";

export default class UrlBasedRpcClient implements RpcClient {
    readonly base: string;
    readonly dataFixer: Productor<any, any>;

    constructor(base: string, dataFixer: Productor<any, any>) {
        this.base = base;
        this.dataFixer = dataFixer;
    }

    call(path: string, ...args: Array<any>): Promise<any> {
        const data = this.dataFixer({
            name: path,
            args,
        });
        return new Promise((resolve, reject) => 
            axios({
                method: "post",
                baseURL: this.base,
                data,
            })
            .then((response: any) => resolve(response.data))
            .catch((e: any) => reject(e))
        );
    }
}