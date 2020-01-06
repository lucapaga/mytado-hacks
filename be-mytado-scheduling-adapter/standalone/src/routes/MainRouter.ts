
import { logger } from '@shared';
import { Request, Response, Router, Express } from 'express';
import { BAD_REQUEST, CREATED, OK, PRECONDITION_FAILED } from 'http-status-codes';
import { paramMissingError } from '@shared';
import { ParamsDictionary } from 'express-serve-static-core';

import { IAnEntity } from '../../../business-logic/dist'
import { MyFirstApplicationService } from '../../../business-logic/dist'

// Init shared
const router = Router();

const specialSchedulesApplicationService: MyFirstApplicationService = new MyFirstApplicationService();


/******************************************************************************
 *  SOME OPERATION  "
 ******************************************************************************/
router.get('/some/path/to', async (req: Request, res: Response) => {
    try {
        console.log("Request Parameters: ", req.params);
        return res.status(OK).json({});
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
