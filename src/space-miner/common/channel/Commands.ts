const Commands = createReadonly({
    GAME_ACTION: createReadonly({
        FACILITY_ACCEPT_OPERATION: "facility_accept_operation",
    }),
    GAME_CONTROL: createReadonly({
        COMMAND_START: "start",
        COMMAND_STOP: "stop",
        COMMAND_GET_TPS: "get_tps",
        COMMAND_SET_TPS: "set_tps",
    }),
    GAME_QUERY: createReadonly({
        COMMAND_ORB: "orb",
        COMMAND_ASSEMBLER: "assembler",
        COMMAND_CONTRACTS: "contracts",
    }),
    GAME_UPDATE: createReadonly({
        UPDATE: "update",
    }),
    REGISTRY: createReadonly({
        COMMAND_GET_KEYS: "get_keys",
        COMMAND_GET_VALUES: "get_values",
        COMMAND_GET: "get",
        REGISTRY_RESOURCE_TYPE: "resource_type",
        REGISTRY_RECIPE: "recipe",
    }),
    UI: createReadonly({
        COMMAND_DISPLAY_MESSAGE: "display_message",
        COMMAND_DISPLAY_OVERLAY: "display_overlay",
        COMMAND_DISPLAY_DIALOG: "display_dialog",
        COMMAND_LEVEL_CHECKED: "level_checked",
        COMMAND_SCREEN_OPEN: "screen_open",
        COMMAND_SCREEN_UPDATE: "screen_update",
        COMMAND_SCREEN_CLOSE: "screen_close",
    }),
});

export default Commands;

function createReadonly<T>(obj: T): Readonly<T> {
    return obj;
}