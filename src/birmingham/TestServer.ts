import RpcClient from "../libs/rpc/RpcClient";
import Profile from "./data/Profile";
import GameStateIdle from "./gamestate/GameStateIdle";

export default class TestServer {

    // profile: Profile = this.createTestProfile();

    createTestProfile() {
        return {
            cards: ["birmingham", "iron_works"],
            money: 100,
            incomeLevel: 30,
            incomePoints: 60,
            totalGoals: 100,

            ordinal: 1,
            action: null,
        };
    }

    resetTestData() {
        // this.profile = this.createTestProfile();
    }
    
    ["getProfile"](client: RpcClient) {
        // return this.profile;
    }
    
    ["getState"](client: RpcClient) {
        // const action = this.profile.action;
        // if (!action) return {
        //     type: "chooseAction",
        //     data: {},
        // };
        // else return {
        //     type: "action/" + action.type,
        //     data: action.data,
        // };
    }

    ["setActionState"](client: RpcClient, type: string, card: string) {
        // let action = this.profile.state;
        // if (!action) {
        //     action = { type, card, data: {} };
        //     this.profile.state = new GameStateIdle({} as any);
        // } else {
        //     action.type = type;
        //     action.card = card;
        // }

        // return {
        //     succeeded: true,
        //     errorMessage: "",
        // };
    }

    ["performAction"](client: RpcClient, data: any) {
        // this.profile.state = new GameStateIdle({} as any);

        // return {
        //     succeeded: true,
        //     errorMessage: "",
        // };
    }

    ["get"](client: RpcClient, data: any) {
        return {
            succeeded: true,
            errorMessage: "",
        };
    }

    ["resetRound"](client: RpcClient, data: any) {
        // this.profile.state = new GameStateIdle({} as any);

        // return {
        //     succeeded: true,
        //     errorMessage: "",
        // };
    }

    ["resetAction"](client: RpcClient, data: any) {
        // this.profile.state = new GameStateIdle({} as any);

        // return {
        //     succeeded: true,
        //     errorMessage: "",
        // };
    }
}