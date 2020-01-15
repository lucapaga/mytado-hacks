import { IZone, Zone } from 'mytado-hacks-be-commons';

export class MyTadoServicesZonesAdapter {
    public deserializeZones(httpData: any): IZone[] | null {
        if (httpData != null) { 
            var retZones: IZone[] = [];
            httpData.forEach((aDataElement:any) => {
                retZones.push(new Zone(+aDataElement["id"], aDataElement["name"], aDataElement["type"], aDataElement["devices"][0]["batteryState"]));
            });
            return retZones;
        }
        else {
            return null;
        }
    }
}