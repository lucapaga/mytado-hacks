import * as functions from 'firebase-functions';
//import * as cors from "cors";

//import { pathToRegexp, match, parse, compile } from "path-to-regexp";
import { pathToRegexp, match, Key } from "path-to-regexp";
import { MyTadoMonitoringServices, MyTadoServicesZonesAdapter } from 'mytado-hacks-be-monitoring-adapter-bl';


// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const mthMonitoringFB = functions.https.onRequest((req, res) => {
    /*
    const corsHandler = cors({
        origin: true,
    });
    corsHandler(req, res, async () => {
        */
        console.log("Serving resource request: '" + req.path + "'");

        const matchZones = match("/:fnName/homes/:homeId/zones", { decode: decodeURIComponent });
        const matchZonesOnPath = matchZones(req.path);
        console.log("MatchZones - StyleOne", matchZonesOnPath);

        const matchZonesS2 = match("/homes/:homeId/zones", { decode: decodeURIComponent });
        const matchZonesOnPathS2 = matchZonesS2(req.path);
        console.log("MatchZones - StyleTwo", matchZonesOnPathS2);

        const matchZoneDetails = match("/:fnName/homes/:homeId/zone/:zoneId", { decode: decodeURIComponent });
        const matchZoneDetailsOnPath = matchZoneDetails(req.path);
        console.log("MatchZoneDetails - StyleOne", matchZoneDetailsOnPath);

        const matchZoneDetailsS2 = match("/homes/:homeId/zone/:zoneId", { decode: decodeURIComponent });
        const matchZoneDetailsOnPathS2 = matchZoneDetailsS2(req.path);
        console.log("MatchZoneDetails - StyleTwo", matchZoneDetailsOnPathS2);

        if (matchZonesOnPath || matchZonesOnPathS2) {
            console.log("Going with zones");
            const keys: Key[] = [];
            const re = pathToRegexp(((matchZonesOnPath) ? '/:fnName/homes/:homeId/zones' : '/homes/:homeId/zones'), keys, { strict: false });
            const pathVars = re.exec(req.path);
            //console.log("This is the compiled regex result", pathVars);
            if (pathVars) {
                const homeId = (matchZonesOnPath) ? pathVars[2] : pathVars[1];
                if(matchZonesOnPath) { console.log("I'm a cloud-function and my name is '" + pathVars[1] + "'"); }
                console.log("Working on HOME ", homeId);

                try {
                    //console.log("Request Parameters: ", req.params);
                    const applicationService = new MyTadoMonitoringServices();
                    applicationService.getZonesIn(+homeId).then(
                        (data) => {
                            //console.log("Zones retrieved: ", data);
                            const mytsa = new MyTadoServicesZonesAdapter();
                            console.log("Returning ...");
                            return res.status(200).json(mytsa.deserializeZones(data));
                        },
                        (err) => {
                            return res.status(400).json({
                                error: err.message,
                            });
                        });
                } catch (err) {
                    console.error(err.message, err);
                    return res.status(400).json({
                        error: err.message,
                    });
                }
            }
        } else if (matchZoneDetailsOnPath || matchZoneDetailsOnPathS2) {
            console.log("Going with zone details");
            const keys: Key[] = [];
            const re = pathToRegexp(((matchZoneDetailsOnPath) ? '/:fnName/homes/:homeId/zone/:zoneId':'/homes/:homeId/zone/:zoneId'), keys, { strict: false });
            const pathVars = re.exec(req.path);
            //console.log("This is the compiled regex result", pathVars);
            if (pathVars) {
                const homeId = (matchZoneDetailsOnPath) ? pathVars[2] : pathVars[1];
                const zoneId = (matchZoneDetailsOnPath) ? pathVars[3] : pathVars[2];
                if(matchZonesOnPath) { console.log("I'm a cloud-function and my name is '" + pathVars[1] + "'"); }
                console.log("Working on HOME " + homeId + ", ZONE " + zoneId);

                try {
                    //console.log("Request Parameters: ", req.params);
                    const applicationService = new MyTadoMonitoringServices();
                    applicationService.getZoneTelemetricsAndConfiguration(+homeId, +zoneId).then(
                        (data) => {
                            console.log("Returning ...");
                            return res.status(200).json(data);
                        },
                        (err) => {
                            return res.status(400).json({
                                error: err.message,
                            });
                        });
                } catch (err) {
                    console.error(err.message, err);
                    return res.status(400).json({
                        error: err.message,
                    });
                }
            }
        } else {
            console.log("It's not a zones query");
            return res.status(404).send("Unsupported operation");
        }

        console.log("Unable to operate");
        return res.status(404).send("Unable to operate");
    //});
});