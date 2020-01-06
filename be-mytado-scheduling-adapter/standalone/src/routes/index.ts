import { Router } from 'express';
import MainRouter from './MainRouter';

// Init router and path
const router = Router();

// BASE Route is in ../Server.ts

// Add sub-routes
router.use('/', MainRouter);

// Export the base-router
export default router;
