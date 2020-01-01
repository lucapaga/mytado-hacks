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
    // [ { user: "luca.paga@gmail.com", password: "" } ]
    this.http.post(
        "https://auth.tado.com/oauth/token", 
        {}, 
        {
          headers: { 'Content-Type': 'application/json' }, 
          params: {
            client_id: "tado-web-app",
            client_secret: "wZaRN7rpjn3FoNyF5IFuxg9uMzYJcvOoQ8QWiIqS3hfk6gLhVlG57j5YNoZL2Rtc",
            grant_type: "password",
            password: password,
            scope: "home.user",
            username: user
          }
        }).subscribe(
          (data) => {
            var bt : string = data["access_token"];
            this.http.delete<SpecialSchedule[]>(
              "https://my.tado.com/api/v2/homes/" + homeId + "/zones/" + zoneId + "/overlay", 
              {
                headers: { 'Content-Type': 'application/json', Authorization: "Bearer " + bt }
              });
          }
        );
    /*
    return of([
      new SpecialSchedule("ID1", "Primo SRV", false),
      new SpecialSchedule("ID2", "Secondo SRV", false),
      new SpecialSchedule("ID3", "Terzo SRV", true)
    ]);
    */
  }
}
