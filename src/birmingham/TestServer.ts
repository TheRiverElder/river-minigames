import RpcClient from "../libs/rpc/RpcClient";

export default class TestServer {

    actionType: string = "";
    actionCard: string = "";
    actionData: any;
    
    ["getProfile"](client: RpcClient) {
        return {
            cards: ["birmingham", "iron_works"],
            action: {
                type: this.actionType,
                card: this.actionCard,
                data: this.actionData,
            },
        };
    }
    
    ["getState"](client: RpcClient) {
        return {
            type: this.actionType ? ("action/" + this.actionType) : "chooseAction",
            data: this.actionData,
        };
    }

    ["setActionState"](client: RpcClient, action: string, card: string) {
        this.actionType = action;
        this.actionCard = card;

        return {
            succeeded: true,
            errorMessage: "",
        };
    }

    ["performAction"](client: RpcClient, data: any) {
        this.actionData = data;

        this.actionType = "";
        this.actionCard = "";
        this.actionData = null;

        
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

    ["resetRound"](client: RpcClient, data: any) {
        this.actionType = "";
        this.actionCard = "";
        this.actionData = null;

        return {
            succeeded: true,
            errorMessage: "",
        };
    }

    ["resetAction"](client: RpcClient, data: any) {
        this.actionType = "";
        this.actionCard = "";
        this.actionData = null;

        return {
            succeeded: true,
            errorMessage: "",
        };
    }
}