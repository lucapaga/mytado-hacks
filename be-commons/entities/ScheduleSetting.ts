import { IZone } from "./Zone";

export interface IScheduleSetting {
    duration: number;
    activateHeating: boolean;
    temperature: number;
    zone: IZone;
}

export class ScheduleSetting implements IScheduleSetting {
    public duration: number;
    public activateHeating: boolean;
    public temperature: number;
    public zone: IZone;

    constructor(zone: IZone, duration: number, activateHeating: boolean, temperature?: number) {
        this.zone = zone;
        this.duration = duration;
        this.activateHeating = activateHeating;

        if (temperature != null) { this.temperature = temperature; } else { this.temperature = 0; }
    }
}