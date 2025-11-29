import express from 'express'
import { fromNodeMiddleware } from 'h3'
import type { NodeMiddleware } from 'h3'
import { AuthController } from '../../controllers/AuthController'
import { errorHandler } from '../../middleware/errorHandler'

const router = express.Router()

router.use(express.json())
router.post('/', AuthController.login)
router.use(errorHandler)

const routerMiddleware: NodeMiddleware = (req, res, next) =>
  router(req as any, res as any, next as any)

export default fromNodeMiddleware(routerMiddleware)
