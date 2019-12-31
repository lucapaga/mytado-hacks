
export interface IZone {
    id: number;
    name: string;
}

export class Zone implements IZone {
    public id: number;
    public name: string;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}