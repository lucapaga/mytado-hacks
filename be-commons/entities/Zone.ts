import { IZoneDetails } from "./ZoneDetails";

export interface IZone {
    id: number;
    name: string;
    type?: string;
    details?: IZoneDetails;
}

export class Zone implements IZone {
    public id: number;
    public name: string;
    public type?: string;
    public details?: IZoneDetails;

    constructor(id: number, name: string, type?: string) {
        this.id = id;
        this.name = name;
        this.type = type;
    }
}