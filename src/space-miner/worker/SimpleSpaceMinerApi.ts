import { OrbModel } from "../model/orb/Orb";
import SpaceMinerApi from "./SpaceMinerApi";

export default class SimpleSpaceMinerApi implements SpaceMinerApi {

    constructor(
        public readonly worker: Worker,
    ) { }

    getOrbDetail(): Promise<OrbModel> {
        throw new Error("Method not implemented.");
    }

}