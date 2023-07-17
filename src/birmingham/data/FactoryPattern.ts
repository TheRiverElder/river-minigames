import { int } from "../../libs/CommonTypes";

export default class FactoryPattern {
    readonly uid: int;
    readonly industry: string;
    readonly level: int;
    readonly costs: Array<[string, number]>;
    readonly awards: Array<[string, number]>;
    readonly beerPrice: int = 0;

    constructor(uid: int, industry: string, level: int, costs: Array<[string, number]>, awards: Array<[string, number]>, beerPrice: int = 0) {
        this.uid = uid;
        this.industry = industry;
        this.level = level;
        this.costs = costs;
        this.awards = awards;
        this.beerPrice = beerPrice;
    }
    
    static load(data: any): FactoryPattern {
        return new FactoryPattern(
            data.uid,
            data.industry, 
            data.level, 
            data.costs,
            data.awards,
            data.beerPrice,
        );
    }
}