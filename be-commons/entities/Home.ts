export interface IHome {
    id: number;
    name: string;
}

export class Home implements IHome {
    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}