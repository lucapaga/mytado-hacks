
import { logger } from '@shared';
import { Request, Response, Router, Express } from 'express';
import { BAD_REQUEST, CREATED, OK, PRECONDITION_FAILED } from 'http-status-codes';
import { paramMissingError } from '@shared';
import { ParamsDictionary } from 'express-serve-static-core';

import { IZone } from 'mytado-hacks-be-commons';
import { MyTadoMonitoringServices } from 'mytado-hacks-be-monitoring-adapter-bl';
import { MyTadoServicesZonesAdapter } from 'mytado-hacks-be-monitoring-adapter-bl';

// Init shared
const router = Router();

const applicationService: MyTadoMonitoringServices = new MyTadoMonitoringServices();


/******************************************************************************
 *  SOME OPERATION  "
 ******************************************************************************/
router.get('/homes/:homeId/zones', async (req: Request, res: Response) => {
    try {
        console.log("Request Parameters: ", req.params);
        applicationService.getZonesIn(+req.params['homeId']).then(
            (data) => { 
                const mytsa:MyTadoServicesZonesAdapter = new MyTadoServicesZonesAdapter();
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
});

/******************************************************************************
 *  SOME OPERATION  "
 ******************************************************************************/
router.get('/homes/:homeId/zone/:zoneId', async (req: Request, res: Response) => {
    try {
        console.log("Request Parameters: ", req.params);
        applicationService.getZoneTelemetricsAndConfiguration(+req.params['homeId'], +req.params['zoneId']).then(
            (data) => { 
                //const mytsa:MyTadoServicesZonesAdapter = new MyTadoServicesZonesAdapter();
                return res.status(OK).json(data); 
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
});


/******************************************************************************
 *                                     Export
 ******************************************************************************/
export default router;
