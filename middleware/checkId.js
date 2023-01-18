import mongoose from "mongoose";

const checkId = (req, res, next) => {
  const { id } = req.params;
  const valid = mongoose.Types.ObjectId.isValid(id)

  if(!valid) {
    const error = new Error(`No hay tarea con ese ID`)
    return res.status(404).json( {msg: error.message } )
  }
  next()
}

export default checkId