import { Router } from 'express';
const router = Router();

// Import the routes
import apiRoutes from './api/index.js';
router.use('/api', apiRoutes);

router.use('/', apiRoutes);

export default router;
