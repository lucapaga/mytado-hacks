
export class ZoneConfiguration {
    public heating?: boolean;
    public targetTemperature?: number;
    public nextChangePresent?: boolean;
    public nextChangeTime?: Date;
    public nextChangeHeating?: boolean;
    public nextChangeTemperature?: number;
    public overlayPresent?: boolean;
    public overlayActive?: boolean;
    public overlayDuration?: number;
    public overlayHeating?: boolean;
    public overlayTemperature?: number;

    constructor(heating?: boolean, targetTemperature?: number, nextChangeTime?: Date, nextChangeHeating?: boolean, nextChangeTemperature?: number, overlayActive?: boolean, overlayDuration?: number, overlayHeating?: boolean, overlayTemperature?: number, ) {
        this.heating = heating;
        this.targetTemperature = targetTemperature;
        this.nextChangeHeating = nextChangeHeating;
        this.nextChangeTemperature = nextChangeTemperature;
        this.nextChangeTime = nextChangeTime;
        this.overlayActive = overlayActive;
        this.overlayDuration = overlayDuration;
        this.overlayHeating = overlayHeating;
        this.overlayTemperature = overlayTemperature;
    }
}
