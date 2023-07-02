export default class TestServer {
    
    ["getState"](profileUid: number) {
        return {
            name: "idle",
            date: {},
        };
    }

    ["setActionState"](profileUid: number, action: string, card: string) {
        return {
            succeeded: true,
            errorMessage: "",
        };
    }

    ["action/scout"](profileUid: number, action: string, card: string) {
        return {
            succeeded: true,
            errorMessage: "",
        };
    }
}