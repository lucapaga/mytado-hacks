
export interface IAccount {
    id?: string;
    type: string;
    name: string;
    amount: number;
}

export class Account implements IAccount {
    public id?: string;
    public type: string;
    public name: string;
    public amount: number;

    constructor(type: string, name: string, amount?: number, id?: string) {
        this.type = type;
        this.name = name;
        this.amount = amount || 0;
        if(id != null) { this.id = id; }
    }
}
