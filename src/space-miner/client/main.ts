import { createGameWorker } from "../worker";
import SimpleSpaceMinerApi from "./SimpleSpaceMinerApi";
import SpaceMinerApi from "./SpaceMinerApi";

export function connectToWorker(): Promise<SpaceMinerApi> {
    return new Promise((resolve) => {
        const worker = createGameWorker();
        const api = new SimpleSpaceMinerApi(worker);
        resolve(api);
    });
}