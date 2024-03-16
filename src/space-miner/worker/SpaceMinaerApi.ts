import { OrbModel } from "../model/orb/Orb";

export default interface SpaceMinaerApi {
    getOrbDetail(): Promise<OrbModel>;
}
