import { ZoneTelemetrics } from './zones/zone-telemetrics';
import { ZoneConfiguration } from './zones/zone-configuration';

export class Zone {
    public id: number;
    public name: string;

    public telemetrics?: ZoneTelemetrics;
    public configuration?: ZoneConfiguration;

    constructor(id: number, name: string) {
        this.id = id;
        this.name = name;
    }
}
