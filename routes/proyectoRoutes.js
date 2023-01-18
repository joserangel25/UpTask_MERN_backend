import express  from 'express'

import { 
        obtenerProyecto,
        obtenerProyectos,
        crearProyecto,
        editarProyecto,
        eliminarProyecto,
        agregarColaborador,
        eliminarColaborador,
        obtenerTareas,
        buscarColaborador
      } from '../controllers/proyectoController.js'

import checkAuth from '../middleware/checkAuth.js'
import checkId from '../middleware/checkId.js'

const router = express.Router()

// Forma 1 de hacerlo
//router.get('/', checkAuth, obtenerProyectos)
//router.post('/', checkAuth, crearProyecto)

//Forma 2 de hacerlo
router.route('/')
      .get(checkAuth, obtenerProyectos)
      .post(checkAuth, crearProyecto)

router.route('/:id')
      .get(checkAuth, checkId, obtenerProyecto)
      .put(checkAuth, checkId, editarProyecto)
      .delete(checkAuth, checkId, eliminarProyecto)

router.get('/tareas/:id', checkAuth, obtenerTareas)

router.post('/colaboradores/', checkAuth, buscarColaborador)
//Los ID dinámicos son del proyecto, para encontrarlo y proceder con la solicitud a ese proyecto particular
router.post('/colaboradores/:id', checkAuth, agregarColaborador)
router.post('/eliminar-colaborador/:id', checkAuth, eliminarColaborador)



export default router