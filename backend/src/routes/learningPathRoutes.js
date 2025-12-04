import { Router } from 'express';
import { detail, list } from '../controllers/learningPathController.js';

const router = Router();

router.get('/learning-paths', list);
router.get('/learning-paths/:id', detail);

export default router;
