export interface IZoneConfiguration {
    currentHeatingIsActive?: boolean;
    currentHeatingPower?: number;
    currentHeatingTargetTemperature?: number;

    nextChangeTimestamp?: Date;
    nextChangeHeatingIsActive?: boolean;
    nextChangeHeatingPower?: number;
    nextChangeHeatingTargetTemperature?: number;

    overlayDuration?: number;
    overlayHeatingIsActive?: boolean;
    overlayHeatingPower?: number;
    overlayHeatingTargetTemperature?: number;
}

export class ZoneConfiguration implements IZoneConfiguration {
    public currentHeatingIsActive?: boolean;
    public currentHeatingPower?: number;
    public currentHeatingTargetTemperature?: number;

    public nextChangeTimestamp?: Date;
    public nextChangeHeatingIsActive?: boolean;
    public nextChangeHeatingPower?: number;
    public nextChangeHeatingTargetTemperature?: number;

    public overlayDuration?: number;
    public overlayHeatingIsActive?: boolean;
    public overlayHeatingPower?: number;
    public overlayHeatingTargetTemperature?: number;
}