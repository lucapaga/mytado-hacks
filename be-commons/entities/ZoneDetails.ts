import { IZoneMetrics } from "./ZoneMetrics";
import { IZoneConfiguration } from "./ZoneConfiguration";

export interface IZoneDetails {
    metrics?: IZoneMetrics;
    configuration?: IZoneConfiguration;
}

export class ZoneDetails implements IZoneDetails {
    public metrics?: IZoneMetrics;
    public configuration?: IZoneConfiguration;
}