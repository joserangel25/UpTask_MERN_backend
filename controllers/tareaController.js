
import Proyecto from "../models/Proyecto.js"
import Tarea from "../models/Tarea.js"

const agregarTarea = async (req, res) => {
  const { proyecto: idProyecto } = req.body;
  const proyectoExistente = await Proyecto.findOne({ _id: idProyecto })
  if(!proyectoExistente){
    const error = new Error(`No hay un proyecto con ese ID`)
    return res.status(404).json( {msg: error.message } )
  }
  if(proyectoExistente.creador.toString() !== req.usuario._id.toString()){
    const error = new Error(`No tienes los permisos para añadir tareas`)
    return res.status(404).json( {msg: error.message } )
  }

  try {
    const tareaAlmacenada = await Tarea.create(req.body)
    proyectoExistente.tareas.push(tareaAlmacenada._id)
    await proyectoExistente.save()
    res.json(tareaAlmacenada)
  } catch (error) {
    console.log(error)
  }
}

const obtenerTarea = async (req, res) => {
  const { id } = req.params;
  try {
    const tareaEncontrada = await Tarea.findById( id ).populate('proyecto')
    if(tareaEncontrada.proyecto.creador.toString() !== req.usuario._id.toString()){
      const error = new Error(`No tienes los permisos para ver esta tarea`)
      return res.status(403).json( {msg: error.message } )
    }
    res.json(tareaEncontrada)
  } catch (error) {
    const myEror = new Error(`La tarea no existe`)
    return res.status(404).json( {msg: myEror.message } )
  }
  
}

const actualizarTarea = async (req, res) => {
  const { id } = req.params;

    const tareaEncontrada = await Tarea.findById( id ).populate('proyecto')
    if(!tareaEncontrada){
      const myEror = new Error(`La tarea no existe`)
      return res.status(404).json( {msg: myEror.message } )
    }

    if(tareaEncontrada.proyecto.creador.toString() !== req.usuario._id.toString()){
      const error = new Error(`No tienes los permisos para ver esta tarea`)
      return res.status(403).json( {msg: error.message } )
    }

    tareaEncontrada.nombre = req.body.nombre || tareaEncontrada.nombre
    tareaEncontrada.descripcion = req.body.descripcion || tareaEncontrada.descripcion
    tareaEncontrada.prioridad = req.body.prioridad || tareaEncontrada.prioridad
    tareaEncontrada.fechaEntrega = req.body.fechaEntrega || tareaEncontrada.fechaEntrega

    try {
      const tareaAlmacenada = await tareaEncontrada.save()
      res.json(tareaAlmacenada)
    } catch (error) {
      console.log(error);
    }
}

const eliminarTarea = async (req, res) => {
  const { id } = req.params;

    const tareaEncontrada = await Tarea.findById( id ).populate('proyecto')
    if(!tareaEncontrada){
      const myEror = new Error(`La tarea no existe`)
      return res.status(404).json( {msg: myEror.message } )
    }

    if(tareaEncontrada.proyecto.creador.toString() !== req.usuario._id.toString()){
      const error = new Error(`No tienes los permisos para ver esta tarea`)
      return res.status(403).json( {msg: error.message } )
    }

    try {
      const proyecto = await Proyecto.findById(tareaEncontrada.proyecto._id);
      proyecto.tareas.pull(tareaEncontrada._id);
      Promise.allSettled([ await proyecto.save(), await tareaEncontrada.deleteOne() ])
 
      res.json({ msg: 'Tarea eleminada correctamente' })
    } catch (error) {
      console.log(error);
    }
}

const editarEstadoTareas = async (req, res) => {
  const { id } = req.params
  const tareaEncontrada = await Tarea.findById( id ).populate('proyecto');

  if(!tareaEncontrada){
    const myEror = new Error(`La tarea no existe`)
    return res.status(404).json( {msg: myEror.message } )
  }

  if(tareaEncontrada.proyecto.creador.toString() !== req.usuario._id.toString() && 
    !tareaEncontrada.proyecto.colaboradores.some(colabo => colabo._id.toString() === req.usuario._id.toString())){
    const error = new Error(`No tienes los permisos para ejecutar esta acción!`)
    return res.status(403).json( {msg: error.message } )
  }

  tareaEncontrada.estado = !tareaEncontrada.estado;
  tareaEncontrada.completado = req.usuario._id;
  await tareaEncontrada.save();

  const tareaAlmacenada = await Tarea.findById( id ).populate('proyecto').populate('completado');
  res.json(tareaAlmacenada)
}


export {
  agregarTarea,
  obtenerTarea,
  actualizarTarea,
  eliminarTarea,
  editarEstadoTareas
}



