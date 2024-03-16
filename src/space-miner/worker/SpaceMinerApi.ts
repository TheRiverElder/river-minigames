import { OrbModel } from "../model/orb/Orb";

export default interface SpaceMinerApi {
    getOrbDetail(): Promise<OrbModel>;
}
