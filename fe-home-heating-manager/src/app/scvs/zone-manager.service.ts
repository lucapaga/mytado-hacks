import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { Zone } from '../entities/zone';
import { environment } from '../../environments/environment';
import { ZoneTelemetrics } from '../entities/zones/zone-telemetrics';
import { ZoneConfiguration } from '../entities/zones/zone-configuration';
import { ZoneDetails } from '../entities/zones/zone-details';

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

  public getZoneTelemetricsAndConfiguration(homeId: number, aZone: Zone): Observable<ZoneDetails> {
    return this.http.get<any>(environment.mthMonitoringBaseUri + "/homes/" + homeId + "/zone/" + aZone.id)
                    .pipe<ZoneDetails>(
                        map(aDetail => {
                                //var azd: ZoneDetails = new ZoneDetails();
                                aZone.configuration = new ZoneConfiguration();
                                aZone.configuration.heating = aDetail.configuration.currentHeatingIsActive;
                                aZone.configuration.nextChangeHeating = aDetail.configuration.nextChangeHeatingIsActive;
                                aZone.configuration.nextChangeTemperature = aDetail.configuration.nextChangeHeatingTargetTemperature;
                                aZone.configuration.nextChangeTime = aDetail.configuration.nextChangeTimestamp;
                                aZone.configuration.overlayDuration = aDetail.configuration.overlayDuration;
                                aZone.configuration.overlayActive = (aZone.configuration.overlayDuration > 0);
                                aZone.configuration.overlayHeating = aDetail.configuration.overlayHeatingIsActive;
                                aZone.configuration.overlayTemperature = aDetail.configuration.overlayHeatingTargetTemperature;
                                aZone.configuration.targetTemperature = aDetail.configuration.currentHeatingTargetTemperature;
                                aZone.telemetrics = new ZoneTelemetrics();
                                aZone.telemetrics.eventTime = aDetail.metrics.metricsTimestamp;
                                aZone.telemetrics.heating = aDetail.configuration.currentHeatingIsActive;
                                aZone.telemetrics.heatingPower = aDetail.metrics.heatingPowerPercentage;
                                aZone.telemetrics.humidity = aDetail.metrics.humidityPercentage;
                                aZone.telemetrics.temperature = aDetail.metrics.temperatureValue;
                                aZone.telemetrics.windowOpen = aDetail.metrics.windowOpen;
                                return aZone;
                              }));
    /*
    aZone.telemetrics = new ZoneTelemetrics(23, 55, true, 50, new Date());
    aZone.configuration = new ZoneConfiguration(true, 18, new Date("2020/01/31"), true, 23, true, 50*60, true, 20);
    return of(aZone);
    */
  }
}
