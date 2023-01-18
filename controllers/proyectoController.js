import Proyecto from "../models/Proyecto.js"
import Usuario from "../models/Usuario.js"
import Tarea from "../models/Tarea.js"

const obtenerProyectos = async (req, res) => {

  try {
    const proyectos = await Proyecto.find({
      '$or': [
        { colaboradores: { $in: req.usuario }},
        { creador: { $in: req.usuario }}
      ]
    }).select('-tareas')

    if(proyectos.length){
      res.status(201).json(proyectos)
    } else {
      res.status(404).json({ msg: 'El usuario aún no tiene proyectos' })
    }

  } catch (error) {
    console.log(error)
  }
}

const obtenerProyecto = async (req, res) => {
  const { id } = req.params;
  // const valid = mongoose.Types.ObjectId.isValid(id)

  // if(!valid) {
  //   const error = new Error('No hay proyecto con ese ID')
  //   return res.status(404).json( {msg: error.message } )
  // }

  try {
    const proyecto = await Proyecto.findById(id)
    .populate({ path: 'tareas', populate: { path: 'completado', select: 'nombre' }})
    .populate('colaboradores', 'nombre email');
    if(proyecto.creador.toString() !== req.usuario._id.toString() && !proyecto.colaboradores.some(colabora => colabora._id.toString() === req.usuario._id.toString())){
      const error = new Error('Acción no válida. Sin permisos')
      return res.status(401).json({ msg: error.message })
    }

    res.json(proyecto)
  } catch (error) {
    console.log(error)
  }
}

const crearProyecto = async (req, res) => {
  const proyecto = new Proyecto(req.body)
  proyecto.creador = req.usuario._id;
  try {
    const proyectoAlmacenado = await proyecto.save();
    res.status(200).json(proyectoAlmacenado)
  } catch (error) {
    console.log(error)
  }
}

const editarProyecto = async (req, res) => {
  const { id } = req.params;
  
  try {
    const proyecto = await Proyecto.findById(id);

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
      const error = new Error('Acción no válida. Sin permisos')
      return res.status(401).json({ msg: error.message })
    }

    proyecto.nombre = req.body.nombre || proyecto.nombre
    proyecto.descripcion = req.body.descripcion || proyecto.descripcion
    proyecto.cliente = req.body.cliente || proyecto.cliente
    proyecto.fechaEntrega = req.body.fechaEntrega || proyecto.fechaEntrega

    await proyecto.save()
    res.json(proyecto)

  } catch (error) {
    console.log(error)
  }
}

const eliminarProyecto = async (req, res) => {
  const { id } = req.params;
  // const valid = mongoose.Types.ObjectId.isValid(id)

  // if(!valid) {
  //   const error = new Error('No hay proyecto con ese ID')
  //   return res.status(404).json( {msg: error.message } )
  // }
  
  try {
    const proyecto = await Proyecto.findById(id);

    if(proyecto.creador.toString() !== req.usuario._id.toString()){
      const error = new Error('Acción no válida. Sin permisos')
      return res.status(401).json({ msg: error.message })
    }


    await proyecto.deleteOne()
    res.json({ msg: 'Proyecto eliminado exitosamente!' })
    
  } catch (error) {
    console.log(error)
  }
}

const buscarColaborador = async (req, res) => {
  console.log(req.body)
  const { email } = req.body

  const colaborador = await Usuario.findOne({email}).select('-password -confirmado -createdAt -token -updatedAd -__v')
  if(!colaborador){
    const error = new Error('El correo ingresado no existe')
    return res.status(404).json({ msg: error.message })
  }

  res.json(colaborador)
}

const agregarColaborador = async (req, res) => {
  //Valido que el ID obtenido de la ruta sea un proyecto existente
  const proyecto = await Proyecto.findById(req.params.id)
  if(!proyecto){
    const error = new Error('Proyecto no encontrado')
     return res.status(404).json({ msg: error.message })
  }
  //Validar que quien solicita incluir no sea una persona diferente al admin (creador) del proyecto
  if(proyecto.creador.toString() !== req.usuario._id.toString()){
    const error = new Error('No tienes los permisos para agregar colaboradores')
    return res.status(401).json({ msg: error.message })
  }

  //Encuentro al usuario en la base de datos por su correo
  const usuarioColaborador = await Usuario.findOne(req.body)

  if(!usuarioColaborador){
    const error = new Error('El usuario no está creado en la base de datos')
    return res.status(401).json({ msg: error.message })
  }

  //Validar que el ADmin no se esté tratando de incluir
  if(proyecto.creador.toString() === usuarioColaborador._id.toString()){
    const error = new Error('El admin no se puede añadir como colaborador')
    return res.status(404).json({ msg: error.message })
  }
  //Validad que no esté incluido ya
  if(proyecto.colaboradores.includes(usuarioColaborador._id)){
    const error = new Error('El usuario ya pertenece al proyecto.')
    return res.status(404).json({ msg: error.message })
  }

  //Se incluye el colaborador si pasa todas las anteriores validaciones
  proyecto.colaboradores.push(usuarioColaborador._id)
  await proyecto.save()
  res.json({ msg: 'El Colaborador ha sido agregado correctamente al proyecto' })
}

const eliminarColaborador = async (req, res) => {
  try {
    //Valido que el ID obtenido de la ruta sea un proyecto existente
  const proyecto = await Proyecto.findById(req.params.id)
  if(!proyecto){
    const error = new Error('Proyecto no encontrado')
    return res.status(404).json({ msg: error.message })
  }
  //Validar que quien solicita incluir no sea una persona diferente al admin (creador) del proyecto
  if(proyecto.creador.toString() !== req.usuario._id.toString()){
    const error = new Error('No tienes los permisos para agregar colaboradores')
    return res.status(401).json({ msg: error.message })
  }

  //Se elimina el colaborador si pasa todas las anteriores validaciones
  proyecto.colaboradores.pull(req.body.id)
  await proyecto.save()
  res.json({ msg: 'Colabodorador eliminado correctamente' })

  } catch (error) {
    console.log(error)
  }
  
}

const obtenerTareas = (req, res) => {}


export {
  obtenerProyecto,
  obtenerProyectos,
  crearProyecto,
  editarProyecto,
  eliminarProyecto,
  buscarColaborador,
  agregarColaborador,
  eliminarColaborador,
  obtenerTareas,
}


