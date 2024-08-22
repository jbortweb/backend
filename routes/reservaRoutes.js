import express from 'express'
import {createReserva, deleteReserva, getReservaDate, getReservasById, updateReserva} from '../controllers/reservaController.js'
import authMiddleware from '../middleware/authMiddleware.js'

const router = express.Router()

router.route('/')
  .post(authMiddleware, createReserva)
  .get(authMiddleware, getReservaDate)

router.route('/:id')
  .get(authMiddleware, getReservasById)
  .put(authMiddleware, updateReserva)
  .delete(authMiddleware, deleteReserva)


export default router