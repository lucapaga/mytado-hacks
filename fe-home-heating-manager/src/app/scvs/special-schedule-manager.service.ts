import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { SpecialSchedule } from '../entities/special-schedule/special-schedule';

@Injectable({
  providedIn: 'root'
})
export class SpecialScheduleManagerService {

  constructor(private http: HttpClient) { }

  listSpecialSchedulesFor(homeId: number): Observable<SpecialSchedule[]> {
    return this.http.get<SpecialSchedule[]>(environment.mthapisBaseUri + "/homes/" + homeId + "/special-schedules/");
    /*
    return of([
      new SpecialSchedule("ID1", "Primo SRV", false),
      new SpecialSchedule("ID2", "Secondo SRV", false),
      new SpecialSchedule("ID3", "Terzo SRV", true)
    ]);
    */
  }

  activateSchedule(homeId: number, specialSchedule: SpecialSchedule): Observable<Object> {
    return this.http.put<SpecialSchedule>(
              environment.mthapisBaseUri + "/homes/" + homeId + "/special-schedules/" + specialSchedule.id + "/ON", 
              {}
            );
  }

  deactivateSchedule(homeId: number, specialSchedule: SpecialSchedule): Observable<Object> {
    return this.http.put(
              environment.mthapisBaseUri + "/homes/" + homeId + "/special-schedules/" + specialSchedule.id + "/OFF", 
              {}
            );
  }
}
