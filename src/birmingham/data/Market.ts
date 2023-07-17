

export default class Market {
    readonly capacityLevel: number;
    amount: number;

    constructor(capacityLevel: number, amount: number) {
        this.capacityLevel = capacityLevel;
        this.amount = amount;
    }
    
    static load(data: any): Market {
        return new Market(data.capacityLevel, data.amount);
    }

}