
import { logger } from '@shared';
import { Request, Response, Router, Express } from 'express';
import { BAD_REQUEST, CREATED, OK, PRECONDITION_FAILED } from 'http-status-codes';
import { paramMissingError } from '@shared';
import { ParamsDictionary } from 'express-serve-static-core';

import { doSaluteWorld, ISpecialSchedule, SpecialSchedule } from '../../../business-logic'
import { SpecialSchedulesApllicationService } from '../../../business-logic'

// Init shared
const router = Router();
var specialSchedule: ISpecialSchedule;
//const accountDao = new AccountDao();

const specialSchedulesApplicationService: SpecialSchedulesApllicationService = new SpecialSchedulesApllicationService();


/******************************************************************************
 *  List all special schedules available for Home "
 ******************************************************************************/
router.get('/homes/:homeId/special-schedules', async (req: Request, res: Response) => {
    try {
        console.log("Request Parameters: ", req.params);
                
        const specialz: ISpecialSchedule[] = specialSchedulesApplicationService.findSpecialSchedulesForHome(+req.params['homeId']);
        const sRet = specialz.map(aSpecial => { 
            return {    id: aSpecial.id, 
                        description: aSpecial.description, 
                        active: aSpecial.isActive, 
                        homeId: aSpecial.home.id,
                        zones: aSpecial.settings.map(aSetting => { return { id: aSetting.zone.id, name: aSetting.zone.name } } ) } 
        });

        return res.status(OK).json(sRet);
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *  Special Schedule Details "
 ******************************************************************************/
router.get('/homes/:homeId/special-schedules/:scheduleUUID', async (req: Request, res: Response) => {
    try {
        console.log("Request Parameters: ", req.params);
        var specialS = specialSchedulesApplicationService.findSpecialSchedulesById(+req.params['homeId'], req.params['scheduleUUID']);
        console.log("here is what I found: ", specialS);
        if(specialS == null) {
            return res.status(OK).json({});
        } else {
            return res.status(OK).json(specialS);
        }
    } catch (err) {
        logger.error(err.message, err);
        return res.status(BAD_REQUEST).json({
            error: err.message,
        });
    }
});

/******************************************************************************
 *  Activate / Deactivate Special Schedule on HOME "
 ******************************************************************************/
router.put('/homes/:homeId/special-schedules/:scheduleUUID/:command', async (req: Request, res: Response) => {
    try {
        console.log("Request Parameters: ", req.params);
        const { homeId, scheduleUUID, command } = req.params as ParamsDictionary;

        if (command == "ON") {
            console.log("Activating schedule '" + scheduleUUID + "' on home '" + homeId + "'");
            await specialSchedulesApplicationService.findAndActivateSchedule(+req.params['homeId'], req.params['scheduleUUID']);
            return res.status(OK).json({});
        } else if (command == "OFF") {
            console.log("Deactivating schedule '" + scheduleUUID + "' on home '" + homeId + "'");
            await specialSchedulesApplicationService.findAndDeactivateSchedule(+req.params['homeId'], req.params['scheduleUUID']);
            return res.status(OK).json({});
        } else {
            const errMsg = "Invalid command '" + command + "'";
            console.log(errMsg);
            return res.status(PRECONDITION_FAILED).json({ "errorMessage": errMsg });
        }
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
