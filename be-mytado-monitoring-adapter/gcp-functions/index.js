'use strict';

const escapeHtml = require('escape-html');
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");

const { MyTadoMonitoringServices, MyTadoServicesZonesAdapter } = require('mytado-hacks-be-monitoring-adapter-bl');



exports.mthMonitoring = (req, res) => {
  console.log("Serving resource '" + req.path + "' ...");

  const matchZones = match("/:fnName/homes/:homeId/zones", { decode: decodeURIComponent });
  const matchZonesOnPath = matchZones(req.path);
  console.log("MatchZones - StyleOne", matchZonesOnPath);

  const matchZones2 = match("/homes/:homeId/zones", { decode: decodeURIComponent });
  const matchZonesOnPath2 = matchZones2(req.path);
  console.log("MatchZones", matchZonesOnPath2);

  const matchZoneDetails = match("/:fnName/homes/:homeId/zone/:zoneId", { decode: decodeURIComponent });
  const matchZoneDetailsOnPath = matchZoneDetails(req.path);
  console.log("MatchZoneDetails - StyleOne", matchZoneDetailsOnPath);

  const matchZoneDetails2 = match("/homes/:homeId/zone/:zoneId", { decode: decodeURIComponent });
  const matchZoneDetailsOnPath2 = matchZoneDetails2(req.path);
  console.log("MatchZoneDetails", matchZoneDetailsOnPath2);

  if (matchZonesOnPath || matchZonesOnPath2) {
    console.log("Going with zones");
    var keys = [];
    const re = pathToRegexp(((matchZonesOnPath) ? '/:fnName/homes/:homeId/zones' : '/homes/:homeId/zones'), keys, { strict: false });
    var pathVars = re.exec(req.path);
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
        logger.error(err.message, err);
        return res.status(400).json({
          error: err.message,
        });
      }
    }
  } else if (matchZoneDetailsOnPath || matchZoneDetailsOnPathS2) {
    console.log("Going with zone details");
    var keys = [];
    const re = pathToRegexp(((matchZoneDetailsOnPath) ? '/:fnName/homes/:homeId/zone/:zoneId':'/homes/:homeId/zone/:zoneId'), keys, { strict: false });
    var pathVars = re.exec(req.path);
    //console.log("This is the compiled regex result", pathVars);
    if (pathVars) {
      const homeId = (matchZoneDetailsOnPath) ? pathVars[2] : pathVars[1];
      const zoneId = (matchZoneDetailsOnPath) ? pathVars[3] : pathVars[2];
      if(matchZoneDetailsOnPath) { console.log("I'm a cloud-function and my name is '" + pathVars[1] + "'"); }
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
        logger.error(err.message, err);
        return res.status(400).json({
          error: err.message,
        });
      }
    }
  } else {
    console.log("It's not a zones query");
    res.status(404).send("Unsupported operation");
  }

};
