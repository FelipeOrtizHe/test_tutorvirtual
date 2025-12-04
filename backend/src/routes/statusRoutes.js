import { Router } from 'express';
import { getStatus } from '../controllers/statusController.js';

const router = Router();

// Ruta de salud para monitoreo del backend
router.get('/status', getStatus);

export default router;
