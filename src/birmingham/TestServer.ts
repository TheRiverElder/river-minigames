import RpcClient from "../libs/rpc/RpcClient";

export default class TestServer {
    
    ["getProfile"](client: RpcClient) {
        return {
            cards: ["birmingham", "iron_works"],
        };
    }
    
    ["getState"](client: RpcClient) {
        return {
            // type: "idle",
            type: "chooseAction",
            data: {},
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