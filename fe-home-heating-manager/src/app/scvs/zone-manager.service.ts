import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { Zone } from '../entities/zone';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ZoneManagerService {
  private mockedZoneList: Zone[] =[
    new Zone(12, "CICCIO SRV"),
    new Zone(22, "CUCCO SRV")
  ];

  constructor(private http: HttpClient) { }

  public listZones(homeId:number):Observable<Zone[]> {
    return this.http.get<Zone[]>(environment.mthMonitoringBaseUri + "/homes/" + homeId + "/zones");
    //return of(this.mockedZoneList);
  }
}
