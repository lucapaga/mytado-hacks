import * as functions from 'firebase-functions';

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
    const matchZones = match("/homes/:homeId/zones", { decode: decodeURIComponent });
    const matchZonesOnPath = matchZones(req.path);
    console.log("MatchZones", matchZonesOnPath);

    const matchZoneDetails = match("/homes/:homeId/zone/:zoneId", { decode: decodeURIComponent });
    const matchZoneDetailsOnPath = matchZoneDetails(req.path);
    console.log("MatchZoneDetails", matchZoneDetailsOnPath);

    if (matchZonesOnPath) {
        console.log("Going with zones");
        let keys: Key[] = [];
        const re = pathToRegexp('/homes/:homeId/zones', keys, { strict: false });
        const pathVars = re.exec(req.path);
        //console.log("This is the compiled regex result", pathVars);
        if (pathVars) {
            console.log(JSON.stringify(pathVars));
            const homeId = pathVars[1];
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
    } else if (matchZoneDetailsOnPath) {
        console.log("Going with zone details");
        let keys: Key[] = [];
        const re = pathToRegexp('/homes/:homeId/zone/:zoneId', keys, { strict: false });
        const pathVars = re.exec(req.path);
        //console.log("This is the compiled regex result", pathVars);
        if (pathVars) {
            //console.log(JSON.stringify(pathVars));
            const homeId = pathVars[1];
            const zoneId = pathVars[2];
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
});