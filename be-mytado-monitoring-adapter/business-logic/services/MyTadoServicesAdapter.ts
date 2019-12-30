import { IMyTadoOverlay } from "./"
import { MyTadoOverlay } from "./MyTadoOverlay";

export interface IMyTadoServicesAdapter {
    addTimedTemperatureOverlayForHomeAndZone(homeId: string, zoneId: string, temperature: number, duration: number): IMyTadoOverlay;
    removeOverlayForHomeAndZone(homeId: string, zoneId: string): IMyTadoOverlay;
}

export class MyTadoServicesAdapter implements IMyTadoServicesAdapter {
    addTimedTemperatureOverlayForHomeAndZone(homeId: string, zoneId: string, temperature: number, duration: number): IMyTadoOverlay {
        console.info("Adding overlay. Home=" + homeId + ", Zone=" + zoneId + ", T=" + temperature + " C, duration=" + duration + "s");
        return new MyTadoOverlay();
    }
    removeOverlayForHomeAndZone(homeId: string, zoneId: string): IMyTadoOverlay {
        console.info("Adding overlay. Home=" + homeId + ", Zone=" + zoneId);
        return new MyTadoOverlay();
    }
}