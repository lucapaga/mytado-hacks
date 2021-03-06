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
            //console.log("Analiizing response", data);

            var retZone : IZoneDetails = new ZoneDetails();
            
            var zoneMetrics: IZoneMetrics = new ZoneMetrics();
            zoneMetrics.linkActive = ceccia.trueIf(data["link"]["state"], "ONLINE");
            zoneMetrics.metricsTimestamp = new Date();
            if(data["sensorDataPoints"] != null && data["sensorDataPoints"]["insideTemperature"] != null) {
                zoneMetrics.temperatureValue = +data["sensorDataPoints"]["insideTemperature"]["celsius"];
                if(data["sensorDataPoints"]["insideTemperature"]["precision"] != null) {
                    zoneMetrics.temperaturePrecision = +data["sensorDataPoints"]["insideTemperature"]["precision"]["celsius"];
                }
                if(data["sensorDataPoints"]["humidity"] != null) {
                    zoneMetrics.humidityPercentage = +data["sensorDataPoints"]["humidity"]["percentage"];
                }
            }
            if(data["activityDataPoints"] != null && data["activityDataPoints"]["heatingPower"] != null) {
                zoneMetrics.heatingPowerPercentage = +data["activityDataPoints"]["heatingPower"]["percentage"];
            }

            zoneMetrics.windowOpen = false;
            if(data["openWindowDetected"] != null && data["openWindowDetected"]) {
                zoneMetrics.windowOpen = true;
            }

            retZone.metrics = zoneMetrics;

            var zoneConf: IZoneConfiguration = new ZoneConfiguration();
            zoneConf.currentHeatingIsActive = ceccia.trueIf(data["setting"]["power"], "ON");
            if(zoneConf.currentHeatingIsActive && zoneMetrics!= null && zoneMetrics.heatingPowerPercentage != null && zoneMetrics.heatingPowerPercentage > 0) {
                zoneConf.currentHeatingIsActive = true;
            } else {
                zoneConf.currentHeatingIsActive = false;
            }
            if(data["setting"] != null && data["setting"]["temperature"] != null) {
                //zoneConf.currentHeatingPower = +data["activityDataPoints"]["heatingPower"]["percentage"];
                zoneConf.currentHeatingTargetTemperature = +data["setting"]["temperature"]["celsius"];
            }
            if(data["nextScheduleChange"] != null) {
                zoneConf.nextChangePresent = true;
                if(data["nextScheduleChange"]["setting"] != null) {
                    zoneConf.nextChangeHeatingIsActive = ceccia.trueIf(data["nextScheduleChange"]["setting"]["power"], "ON");
                    //zoneConf.nextChangeHeatingPower = +data["nextScheduleChange"]["setting"]["power"]
                    if(data["nextScheduleChange"]["setting"]["temperature"] != null) {
                        zoneConf.nextChangeHeatingTargetTemperature = +data["nextScheduleChange"]["setting"]["temperature"]["celsius"];
                    }
                }
                zoneConf.nextChangeTimestamp = data["nextScheduleChange"]["start"];
            } else {
                zoneConf.nextChangePresent = false;
            }
            if(data["overlay"] != null) {
                zoneConf.overlayPresent = true;
                if(data["overlay"]["termination"] != null) {
                    zoneConf.overlayDuration = +data["overlay"]["termination"]["remainingTimeInSeconds"];
                }
                if(data["overlay"]["setting"] != null) {
                    zoneConf.overlayHeatingIsActive = ceccia.trueIf(data["overlay"]["setting"]["power"], "ON");
                    //zoneConf.overlayHeatingPower
                    if(data["overlay"]["setting"]["temperature"] != null) {
                        zoneConf.overlayHeatingTargetTemperature = +data["overlay"]["setting"]["temperature"]["celsius"];
                    }
                }
            } else {
                zoneConf.overlayPresent = false;
            }
            retZone.configuration = zoneConf;

            return retZone;
        }).catch(function (err: any) {
            console.error(err["message"]);
        });
    }

}