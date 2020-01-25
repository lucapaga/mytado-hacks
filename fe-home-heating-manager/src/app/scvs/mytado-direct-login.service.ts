import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { Observable, of, pipe } from 'rxjs';
import { map } from 'rxjs/operators';
import { MytadoAuthorization } from '../entities/mytado-authorization';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class MytadoDirectLoginService {
  private cachedUserName?: string;
  private cachedPassword?: string;
  private authorization?: MytadoAuthorization;

  constructor(private http: HttpClient) { 
  }

  public login(user?: string, password?: string): Observable<MytadoAuthorization> {
    if (user == null || user == undefined || user === "") {
      user = this.cachedUserName;
    }
    if (password == null || password == undefined || password === "") {
      password = this.cachedPassword;
    }

    console.log("Logging in (user=" + user + ") ...");

    /*
    const options = {
        method: 'POST',
        uri: 'https://auth.tado.com/oauth/token',
        formData: {
            client_id: "tado-web-app",
            client_secret: "wZaRN7rpjn3FoNyF5IFuxg9uMzYJcvOoQ8QWiIqS3hfk6gLhVlG57j5YNoZL2Rtc",
            grant_type: "password",
            password: password,
            scope: "home.user",
            username: user
        },
        json: true
    };
    */ 

    const bodyData: any = {
                            client_id: "tado-web-app",
                            client_secret: "wZaRN7rpjn3FoNyF5IFuxg9uMzYJcvOoQ8QWiIqS3hfk6gLhVlG57j5YNoZL2Rtc",
                            grant_type: "password",
                            password: password,
                            scope: "home.user",
                            username: user
                        };
    return this.http.post<any>(environment.mytadoAuthURI, bodyData)
                    .pipe<MytadoAuthorization>(
                      map(httpResultObj => {
                        return new MytadoAuthorization(user, password, httpResultObj["access_token"]);
                      }));
    //console.log("Payload: ", options);
    /*
    return rp(options).then(function (data: any) {
        console.info("Successfully logged in");
        return new MyTadoServiceAuthorization(data['access_token']);
    }).catch(function (err: any) {
        console.error(err["message"]);
        return null;
    });
    */
}

}
