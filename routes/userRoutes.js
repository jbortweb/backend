import express from 'express'
import authMiddleware from '../middleware/authMiddleware.js'
import { getUserReservas } from '../controllers/userController.js'

const router = express.Router()

router.route('/:user/reservas')
  .get(authMiddleware, getUserReservas)

export default router
