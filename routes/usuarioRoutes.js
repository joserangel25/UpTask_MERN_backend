import express from 'express'
const router = express.Router()
import { registrar, 
         autenticar, 
         confirmar, 
         recoveryPassword, 
         comprobarToken, 
         nuevoPassword,
         perfil } from '../controllers/usuarioController.js'

import checkAuth from '../middleware/checkAuth.js'

//Autenticacion, registsro y confirmación de usuarios
router.post('/', registrar)
router.post('/login', autenticar)
router.get('/confirmar/:token', confirmar)
//Se solicita token para cambiar el password
router.post('/recuperar-clave', recoveryPassword) 
// Se comprueba el token del email vs. DB para que cambie la clave
router.get('/recuperar-clave/:token', comprobarToken)
//Se actualiza la nueva contraseña 
router.post('/recuperar-clave/:token', nuevoPassword) 
//Otra manera de hacerlo con express cuando apuntas a la misma ruta pero con verbos diferentes
//router.route('/recuperar-clave/:token').get(comprobarToken).post(nuevoPassword)

router.get('/perfil', checkAuth, perfil)

export default router