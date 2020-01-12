import { IZone, IZoneDetails } from "mytado-hacks-be-commons";
import { MyTadoServicesAdapter, MyTadoServiceAuthorization } from "mytado-hacks-be-commons";

export class MyTadoMonitoringServices {

    private myTadoServiceAdapter: MyTadoServicesAdapter = new MyTadoServicesAdapter();

    async getZonesIn(homeId: number): Promise<IZone[]> {
        var authToken: MyTadoServiceAuthorization = await this.myTadoServiceAdapter.login();
        return this.myTadoServiceAdapter.getZonesIn(homeId, authToken);
    }

    async getZoneTelemetricsAndConfiguration(homeId: number, zoneId: number): Promise<IZoneDetails> {
        var authToken: MyTadoServiceAuthorization = await this.myTadoServiceAdapter.login();
        return this.myTadoServiceAdapter.getZoneTelemetricsAndConfiguration(homeId, zoneId, authToken);
    }

}