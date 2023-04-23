import Usuario from "../models/Usuario.js"
import generarId from "../helpers/generarId.js";
import generarJWT from "../helpers/generarJWT.js";
import { emailRecuperarClave, emailRegistro } from "../helpers/email.js";

const registrar = async (req, res) => {

  const { email } = req.body;
  const existeUsuario = await Usuario.findOne({ email })
  if(existeUsuario){
    const error = new Error('El email ya está registrado');
    return res.status(400).json({ msg: error.message })
  }
  
  // res.json({msg: 'Usuario creado'})
  try {
    const usuario = new Usuario(req.body)
    usuario.token = generarId();
    await usuario.save()

    //Enviando los datos al Email
    await emailRegistro({
      nombre: usuario.nombre,
      email: usuario.email,
      token: usuario.token
    }) 
    res.json({msg: 'Usuario creado correctamente. Revisa tu email para confirmar la cuenta y acceder'})
  } catch (error) {
    console.log(error)
  }
}

const autenticar = async (req, res) => {
  
  const { email, password } = req.body

  //Comprobar si el usuario existe
  const usuario = await Usuario.findOne({ email })
  if(!usuario){
    const error = new Error('El correo no está asociado a una cuenta creada');
    return res.status(404).json({msg: error.message})
  }
  
  //Comprobar si el usuario está confirmado
  if(!usuario.confirmado){
    const error = new Error('Tu cuenta no ha sido confirmada. Sigue las instrucciones enviadas a tu email!');
    return res.status(403).json({msg: error.message})
  }
  //Comprobar su password

  if(await usuario.comprobarPassword(password)){
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      token: generarJWT(usuario._id)
    })
  } else {
    const error = new Error('Tu password es incorrecto');
    res.status(403).json({msg: error.message})
  }
}

const confirmar = async (req, res) => {
  const { token } =  req.params;
  
  const usuarioConfirmar = await Usuario.findOne({ token }) 

  if(!usuarioConfirmar){
    const error = new Error('El token es invalido');
    res.status(403).json({ msg: error.message })
  }

  try {
    usuarioConfirmar.confirmado = true;
    usuarioConfirmar.token = '';
    await usuarioConfirmar.save();
    res.json({msg: 'El usuario se confirmó correctamente'})
  } catch (error) {
    console.log(error)
  }
}

const recoveryPassword = async (req, res) => { 
  const { email } = req.body;

  const usuarioConfirmar = await Usuario.findOne({ email });
  if(!usuarioConfirmar){
    const error = new Error('El correo no existe en la base de datos');
    res.status(403).json({ msg: error.message })
  }

  try {
    usuarioConfirmar.token = generarId();
    await usuarioConfirmar.save();
    res.json({ msg: 'Hemos enviando un email con las instrucciones' }) 

    emailRecuperarClave({
      nombre: usuarioConfirmar.nombre,
      email: usuarioConfirmar.email,
      token: usuarioConfirmar.token
    })
  } catch (error) {
    console.log(error)
  }

}

const comprobarToken = async (req, res) => {
  const { token } = req.params;
  const tokenEncontrado = await Usuario.findOne({ token });

  if(tokenEncontrado){
    res.json({msg: 'El token es válido y el usuario existe'})
  } else {
    const error = new Error('Token no válido')
    res.status(404).json({msg: error.message})
  }
}

const nuevoPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  const usuarioActualizar = await Usuario.findOne({ token });
  if(usuarioActualizar){
    usuarioActualizar.password = password;
    usuarioActualizar.token = '';
    
    try {
      await usuarioActualizar.save()
      res.json({ msg: 'La contraseña se ha guardado correctamente' })      
    } catch (error) {
      console.log(error)
    }

  } else {
    const error = new Error('El token no es válido');
    res.status(404).json({msg: error.message})
  }

}

const perfil = async (req, res) => {
  const { usuario } = req
  res.status(201).json(usuario)
}

export {
  registrar,
  autenticar,
  confirmar,
  recoveryPassword,
  comprobarToken,
  nuevoPassword,
  perfil  
}