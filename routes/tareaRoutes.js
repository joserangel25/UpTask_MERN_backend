import express from 'express'
import { actualizarTarea, 
         agregarTarea,
         obtenerTarea, 
         eliminarTarea, 
         editarEstadoTareas } from '../controllers/tareaController.js';
import checkAuth from '../middleware/checkAuth.js';

const router = express.Router();

router.post('/', checkAuth, agregarTarea)
router.route('/:id')
          .get( checkAuth, obtenerTarea )
          .put( checkAuth, actualizarTarea )
          .delete( checkAuth, eliminarTarea )

router.post('/estado/:id', checkAuth, editarEstadoTareas)

export default router