import { IAccount } from './Account';

export interface ITransaction {
    id?: string;
    account?: IAccount;
    code?: string;
    value?: string;
    description: string;
    eventDate: Date;
    accountDate: Date;
    amount: number;
}

export class Transaction implements ITransaction {
    public id?: string;
    public account?: IAccount; 
    public code?: string;
    public value?: string;
    public description: string;
    public eventDate: Date;
    public accountDate: Date;
    public amount: number;

    constructor(eventDate: Date, description: string, amount: number, accountDate?: Date, id?: string, account?: IAccount, code?: string, value?: string) {
        this.eventDate = eventDate;
        this.description = description;
        this.amount = amount || 0;

        if(id != null) { this.id = id; }
        if(account != null) {this.account = account}
        if(code != null) { this.code = code; }
        if(value != null) { this.value = value; }
        
        if(accountDate != null) {
            this.accountDate = accountDate;
        } else {
            this.accountDate = eventDate;
        }
    }
}
