'use strict';

const escapeHtml = require('escape-html');
const { pathToRegexp, match, parse, compile } = require("path-to-regexp");

const { MyTadoMonitoringServices, MyTadoServicesZonesAdapter } = require('mytado-hacks-be-monitoring-adapter-bl');

exports.helloworld = (req, res) => {
  res.send('Hello World!');
};

exports.getZonesInformation = (req, res) => {
  var keys = [];
  var re = pathToRegexp('/homes/:homeId/zones', keys, {strict: false});
  var pathVars = re.exec(req.path);
  if (pathVars) {
      console.log(JSON.stringify(pathVars));
      var homeId = pathVars[1];
      console.log("Working on HOME ", homeId);

      try {
        console.log("Request Parameters: ", req.params);
        const applicationService = new MyTadoMonitoringServices();
        applicationService.getZonesIn(+homeId).then(
            (data) => { 
                const mytsa = new MyTadoServicesZonesAdapter();
                return res.status(OK).json(mytsa.deserializeZones(data)); 
            }, 
            (err) => {
            return res.status(BAD_REQUEST).json({
                error: err.message,
            });
        });
      } catch (err) {
          logger.error(err.message, err);
          return res.status(BAD_REQUEST).json({
              error: err.message,
          });
      }
  }
  //res.send('Hello World!');
};
