import { Router } from 'express';
import SpecialSchedulesRouter from './SpecialSchedulesRouter';

// Init router and path
const router = Router();

// BASE Route is in ../Server.ts

// Add sub-routes
router.use('/', SpecialSchedulesRouter);

// Export the base-router
export default router;
