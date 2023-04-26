

export default class Industry {
    readonly name: string;

    constructor(name: string) {
        this.name = name;
    }
}

export const INDUSTRY_EMPTY = new Industry("");
export const INDUSTRY_ANY = new Industry("*");