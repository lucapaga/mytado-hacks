import { IMyTadoOverlay } from "./"
import { MyTadoOverlay } from "./MyTadoOverlay";
import { MyTadoServiceAuthorization } from "./MyTadoServiceAuthorization";
import { EnvironmentServices } from "./EnvironmentServices";
import { IZone, Zone, IZoneDetails, ZoneDetails, ZoneMetrics, IZoneMetrics, IZoneConfiguration, ZoneConfiguration } from "../entities";

//import { get, put, RequestPromiseOptions } from "request-promise"
var rp = require('request-promise-native');

export interface IMyTadoServicesAdapter {
    login(user?: string, password?: string): Promise<MyTadoServiceAuthorization>;
    addTimedTemperatureOverlayForHomeAndZone(homeId: number, zoneId: number, switchHeatingOn: boolean, temperature: number, duration: number, authToken: MyTadoServiceAuthorization): Promise<IMyTadoOverlay>;
    removeOverlayForHomeAndZone(homeId: number, zoneId: number, authToken: MyTadoServiceAuthorization): Promise<IMyTadoOverlay>;
    getZonesIn(homeId: number, authToken: MyTadoServiceAuthorization): Promise<IZone[]>;
}

export class MyTadoServicesAdapter implements IMyTadoServicesAdapter {
    private authToken: MyTadoServiceAuthorization | null = null;
    private envServices: EnvironmentServices = new EnvironmentServices();

    private trueIf(extractedValue: string, referenceValue: string): boolean {
        if(extractedValue == null || extractedValue === "") {
            return false;
        }

        return extractedValue === referenceValue;
    }

    async login(user?: string, password?: string): Promise<MyTadoServiceAuthorization> {
        if (user == null || user == undefined || user === "") {
            //console.log("Username not passed, using env var", process.env);
            user = this.envServices.envVariable(process.env.MYTADO_SA_USER);
        }
        if (password == null || password == undefined || password === "") {
            //console.log("Password not passed, using env var", process.env);
            password = this.envServices.envVariable(process.env.MYTADO_SA_PWD);
        }

        console.log("Logging in (user=" + this.envServices.envVariable(process.env.MYTADO_SA_USER) + ") ...");

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

        //console.log("Payload: ", options);

        return rp(options).then(function (data: any) {
            console.info("Successfully logged in");
            return new MyTadoServiceAuthorization(data['access_token']);
        }).catch(function (err: any) {
            console.error(err["message"]);
            return null;
        });
    }


    async addTimedTemperatureOverlayForHomeAndZone(homeId: number, zoneId: number, switchHeatingOn: boolean, temperature: number, duration: number, authToken: MyTadoServiceAuthorization): Promise<IMyTadoOverlay> {
        console.info("Adding overlay. Home=" + homeId + ", Zone=" + zoneId + ", SWITCH_ON=" + switchHeatingOn + ", T=" + temperature + " C, duration=" + duration + "s");

        var token: string = "";
        if (authToken == null) {
            console.warn("'authToken' is passed NULL");
        } else {
            //console.log("AuthToken: ", authToken);
            token = authToken.token;
            //console.log("Bearer token: ", token);
        }

        var options = {
            method: 'PUT',
            uri: 'https://my.tado.com/api/v2/homes/' + homeId + '/zones/' + zoneId + '/overlay',
            headers: {
                Authorization: 'Bearer ' + token
            },
            body: {},
            json: true
        };

        if (switchHeatingOn) {
            options.body = {
                setting: {
                    type: "HEATING",
                    power: "ON",
                    temperature: {
                        celsius: temperature
                    }
                },
                termination: {
                    type: "TIMER",
                    durationInSeconds: duration
                }
            };
        } else {
            options.body = {
                setting: {
                    type: "HEATING",
                    power: "OFF"
                },
                termination: {
                    type: "TIMER",
                    durationInSeconds: duration
                }
            };
        }

        //console.log("Payload: ", options);

        return rp(options).then(function (data: any) {
            console.info("Overlay successfully SET on zone ", zoneId);
            return new MyTadoOverlay();
        }).catch(function (err: any) {
            console.error(err["message"]);
        });
    }

    async removeOverlayForHomeAndZone(homeId: number, zoneId: number, authToken: MyTadoServiceAuthorization): Promise<IMyTadoOverlay> {
        console.info("Removing overlay. Home=" + homeId + ", Zone=" + zoneId);

        var token: string = "";
        if (authToken == null) {
            console.warn("'authToken' is passed NULL");
        } else {
            //console.log("AuthToken: ", authToken);
            token = authToken.token;
            //console.log("Bearer token: ", token);
        }

        const options = {
            method: 'DELETE',
            uri: 'https://my.tado.com/api/v2/homes/' + homeId + '/zones/' + zoneId + '/overlay',
            headers: {
                Authorization: 'Bearer ' + token
            },
            body: {},
            json: true
        };

        //console.log("Payload: ", options);

        return rp(options).then(function (data: any) {
            console.info("Overlay successfully UNSET on zone ", zoneId);
            return new MyTadoOverlay();
        }).catch(function (err: any) {
            console.error(err["message"]);
        });
    }

    async getZonesIn(homeId: number, authToken: MyTadoServiceAuthorization): Promise<IZone[]> {
        var token: string = authToken.token;

        const options = {
            method: 'GET',
            uri: 'https://my.tado.com/api/v2/homes/' + homeId + '/zones',
            headers: {
                Authorization: 'Bearer ' + token
            },
            json: true
        };

        return rp(options).then(function (data: any) {
            return data;
        }).catch(function (err: any) {
            console.error(err["message"]);
        });
    }

    async getZoneTelemetricsAndConfiguration(homeId: number, zoneId: number, authToken: MyTadoServiceAuthorization): Promise<IZoneDetails> {
        var token: string = authToken.token;

        const options = {
            method: 'GET',
            uri: 'https://my.tado.com/api/v2/homes/' + homeId + '/zones/' + zoneId + "/state",
            headers: {
                Authorization: 'Bearer ' + token
            },
            json: true
        };

        var ceccia = this;
        return rp(options).then(function (data: any) {
            var retZone : IZoneDetails = new ZoneDetails();
            
            var zoneMetrics: IZoneMetrics = new ZoneMetrics();
            zoneMetrics.linkActive = ceccia.trueIf(data["link"]["state"], "ONLINE");
            zoneMetrics.metricsTimestamp = new Date();
            retZone.metrics = zoneMetrics;

            var zoneConf: IZoneConfiguration = new ZoneConfiguration();
            retZone.configuration = zoneConf;

            return retZone;
        }).catch(function (err: any) {
            console.error(err["message"]);
        });
    }

}