import { ZoneTelemetrics } from './zones/zone-telemetrics';
import { ZoneConfiguration } from './zones/zone-configuration';

export class Zone {
    public id: number;
    public name: string;

    public batteryState?: string;

    public telemetrics?: ZoneTelemetrics;
    public configuration?: ZoneConfiguration;

    constructor(id: number, name: string, batteryState?: string) {
        this.id = id;
        this.name = name;
        this.batteryState = batteryState;
    }
}
