import express from 'express'
import { createServices, getServices, getServicesById, updateService, deleteService } from '../controllers/servicesController.js'

const router = express.Router()

router.route('/')
  .post(createServices)
  .get(getServices)

router.route('/:id')
  .get(getServicesById)
  .put(updateService)
  .delete(deleteService)

export default router