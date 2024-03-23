import Contract, { ContractParty } from "./Contract";

export default class GenericContract implements Contract {

    constructor(
        public readonly uid: number,
        public readonly parties: Array<ContractParty>,
    ) { }

    get completed(): boolean {
        return this.parties.every(it => it.completed);
    }

}