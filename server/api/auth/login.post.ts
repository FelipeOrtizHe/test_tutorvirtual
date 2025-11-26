import express from 'express'
import { fromNodeMiddleware } from 'h3'
import { AuthController } from '../../controllers/AuthController'
import { errorHandler } from '../../middleware/errorHandler'

const router = express.Router()

router.use(express.json())
router.post('/', AuthController.login)
router.use(errorHandler)

export default fromNodeMiddleware(router)
