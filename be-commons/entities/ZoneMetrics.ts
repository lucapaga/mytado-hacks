export interface IZoneMetrics {
    metricsTimestamp?: Date;
    linkActive?: boolean;
    heatingPowerPercentage?: number;
    temperatureValue?: number;
    temperaturePrecision?: number;
    humidityPercentage?: number;
    windowOpen?: boolean;
}

export class ZoneMetrics implements IZoneMetrics {
    public metricsTimestamp?: Date;
    public linkActive?: boolean;
    public heatingPowerPercentage?: number;
    public temperatureValue?: number;
    public temperaturePrecision?: number;
    public humidityPercentage?: number;
    public windowOpen?: boolean;
}