import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Zone } from '../entities/zone';
import { environment } from '../../environments/environment';
import { ZoneTelemetrics } from '../entities/zones/zone-telemetrics';
import { ZoneConfiguration } from '../entities/zones/zone-configuration';

@Injectable({
  providedIn: 'root'
})
export class ZoneManagerService {
  private mockedZoneList: Zone[] = [
    new Zone(12, "CICCIO SRV"),
    new Zone(22, "CUCCO SRV")
  ];

  constructor(private http: HttpClient) { }

  public listZones(homeId: number): Observable<Zone[]> {
    return this.http.get<Zone[]>(environment.mthMonitoringBaseUri + "/homes/" + homeId + "/zones");
    //return of(this.mockedZoneList);
  }

  public getZoneTelemetricsAndConfiguration(homeId: number, aZone: Zone): Observable<Zone> {
    aZone.telemetrics = new ZoneTelemetrics(23, 55, true, 50, new Date());
    aZone.configuration = new ZoneConfiguration(true, 18, new Date("2020/01/31"), true, 23, true, 50*60, true, 20);
    return of(aZone);
  }
}
