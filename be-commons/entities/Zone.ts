import { IZoneDetails } from "./ZoneDetails";

export interface IZone {
    id: number;
    name: string;
    type?: string;
    details?: IZoneDetails;
    batteryState?: string;
}

export class Zone implements IZone {
    public id: number;
    public name: string;
    public type?: string;
    public details?: IZoneDetails;
    public batteryState?: string;

    constructor(id: number, name: string, type?: string, batteryState?: string) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.batteryState = batteryState;
    }
}