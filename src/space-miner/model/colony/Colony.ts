import Orb from "../orb/Orb";
import ColonyCommunity from "./ColonyCommunity";
import ColonyEnergy from "./ColonyEnergy";
import ColonyStorage from "./ColonyStorage";

export interface ColonyProps {
    readonly orb: Orb;
}

export default class Colony {

    public readonly orb: Orb;

    constructor(props: ColonyProps) {
        this.orb = props.orb;
    }

    public readonly storage: ColonyStorage = new ColonyStorage();
    public readonly community: ColonyCommunity = new ColonyCommunity();
    public readonly energy: ColonyEnergy = new ColonyEnergy();
    // public readonly development: ColonyDevelopment;
    // public readonly production: ColonyProduction;
}