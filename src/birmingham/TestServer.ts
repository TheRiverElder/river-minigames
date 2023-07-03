import RpcClient from "../libs/rpc/RpcClient";

export default class TestServer {
    
    ["getState"](client: RpcClient) {
        return {
            name: "idle",
            date: {},
        };
    }

    ["setActionState"](client: RpcClient, action: string, card: string) {
        return {
            succeeded: true,
            errorMessage: "",
        };
    }

    ["performAction"](client: RpcClient, data: any) {
        return {
            succeeded: true,
            errorMessage: "",
        };
    }

    ["get"](client: RpcClient, data: any) {
        return {
            succeeded: true,
            errorMessage: "",
        };
    }
}