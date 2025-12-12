import { Router } from 'express';
import learningPathRoutes from './learningPathRoutes.js';
import statusRoutes from './statusRoutes.js';

const router = Router();

router.use('/api', statusRoutes);
router.use('/api', learningPathRoutes);

export default router;
