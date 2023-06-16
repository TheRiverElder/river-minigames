import TableBottomSimulatorClient from "./TableBottomSimulatorClient";

export interface Extension {
    readonly name: string;
    setup(simulator: TableBottomSimulatorClient): void;
    dispose(simulator: TableBottomSimulatorClient): void;
}