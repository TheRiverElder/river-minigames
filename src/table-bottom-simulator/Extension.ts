import TableBottomSimulatorClient from "./TableBottomSimulatorClient";

export interface Extension {
    readonly simulator: TableBottomSimulatorClient;
    readonly name: string;
    setup(): void;
    dispose(): void;
}