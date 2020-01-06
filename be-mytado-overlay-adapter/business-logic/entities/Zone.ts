
export interface IZone {
    id: number;
    name: string;
    type?: string;
}

export class Zone implements IZone {
    public id: number;
    public name: string;
    public type?: string;

    constructor(id: number, name: string, type?: string) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}