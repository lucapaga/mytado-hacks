import { IMyTadoOverlay } from "./"
import { MyTadoOverlay } from "./MyTadoOverlay";
import { MyTadoServiceAuthorization } from "./MyTadoServiceAuthorization";

//import { get, put, RequestPromiseOptions } from "request-promise"
var rp = require('request-promise-native');

export interface IMyTadoServicesAdapter {
    login(user: string, password: string): MyTadoServiceAuthorization  | null;
    addTimedTemperatureOverlayForHomeAndZone(homeId: number, zoneId: number, temperature: number, duration: number): IMyTadoOverlay;
    removeOverlayForHomeAndZone(homeId: number, zoneId: number): IMyTadoOverlay;
}

export class MyTadoServicesAdapter implements IMyTadoServicesAdapter {
    private authToken: MyTadoServiceAuthorization | null = null;

    login(user: string, password: string): MyTadoServiceAuthorization | null {
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

        console.log("Payload: ", options);

        this.authToken = rp(options).then(function (data: any) {
            console.info(data);
            return new MyTadoServiceAuthorization(data['access_token']);
        }).catch(function (err: any) {
            console.error(err);
            return null;
        });

        return this.authToken;
    }


    addTimedTemperatureOverlayForHomeAndZone(homeId: number, zoneId: number, temperature: number, duration: number): IMyTadoOverlay {
        console.info("Adding overlay. Home=" + homeId + ", Zone=" + zoneId + ", T=" + temperature + " C, duration=" + duration + "s");
        const options = {
            method: 'PUT',
            uri: 'https://my.tado.com/api/v2/' + homeId + '/zones/' + zoneId + '/overlay',
            headers: {
                Authorization: 'Bearer ' + ((this.authToken == null) ? "" : this.authToken.token)
            },
            body: {
                setting: {
                    type: "HEATING",
                    power: "ON",
                    temperature: {
                        celsius: temperature
                    }
                },
                termination: {
                    type: "TIMER",
                    durationInSecond: duration
                }
            },
            json: true
        };

        console.log("Payload: ", options);

        rp(options).then(function (data: any) {
            console.info(data);
        }).catch(function (err: any) {
            console.error(err);
        });

        return new MyTadoOverlay();
    }
    removeOverlayForHomeAndZone(homeId: number, zoneId: number): IMyTadoOverlay {
        console.info("Adding overlay. Home=" + homeId + ", Zone=" + zoneId);
        return new MyTadoOverlay();
    }
}