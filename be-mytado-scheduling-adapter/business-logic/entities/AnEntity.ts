export interface IAnEntity {
    aProp: string;
}

export class AnEntity implements IAnEntity {
    public aProp: string;

    constructor(aProp: string) {
        this.aProp = aProp;
    }
}