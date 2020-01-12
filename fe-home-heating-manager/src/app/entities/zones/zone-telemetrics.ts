import { Time } from '@angular/common';

export class ZoneTelemetrics {
    public eventTime?: Date;
    public temperature?: number;
    public humidity?: number;
    public heating?: boolean;
    public heatingPower?: number;

    constructor(temperature?: number, humidity?: number, heating?: boolean, heatingPower?: number, eventTime?: Date) {
        this.eventTime = eventTime;
        this.temperature = temperature;
        this.humidity = humidity;
        this.heating = heating;
        this.heatingPower = heatingPower;
    }
}
