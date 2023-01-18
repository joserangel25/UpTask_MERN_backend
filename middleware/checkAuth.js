import jwt from 'jsonwebtoken'
import Usuario from '../models/Usuario.js';

const checkAuth = async (req, res, next) => { 
  let token;

  if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
    token = req.headers.authorization.split(' ')[1]
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET)
      req.usuario = await Usuario
      .findById(decoded.id)
      .select('-password -confirmado -token -createdAt -updatedAt -__v')

      return next()

    } catch (error) {
      return res.json({ msg: 'Hubo un error. El Token no es válido' })
    }
  }
  if(!token){
    const error = new Error('No fue enviado el Token. Por favor enviarlo!')
    return res.status(401).json({ msg: error.message })
  }
    next()
}

export default checkAuth