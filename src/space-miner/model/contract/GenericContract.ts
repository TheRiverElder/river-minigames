// import { mapModel } from "../../../libs/io/Displayable";
// import Contract, { ContractModel, ContractParty } from "./Contract";

// export default class GenericContract implements Contract {

//     constructor(
//         public readonly uid: number,
//         public readonly parties: Array<ContractParty>,
//     ) { }

//     get completed(): boolean {
//         return this.parties.every(it => it.completed);
//     }
    
//     getDisplayedModel(): ContractModel {
//         return {
//             uid: this.uid,
//             parties: this.parties.map(it => ({
//                 trader: it.trader.uid,
//                 completed: it.completed,
//                 offers: it.offers.map(mapModel),
//             })),
//             completed: this.completed,
//         };
//     }

// }