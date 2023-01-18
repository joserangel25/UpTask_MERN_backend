// const express = require('express');
import express from 'express'
import dotenv from 'dotenv'
import conectarDB from './config/db.js';
import usuarioRoutes from './routes/usuarioRoutes.js'
import proyectoRoutes from './routes/proyectoRoutes.js'
import tareaRoutes from './routes/tareaRoutes.js'
import cors from 'cors'

const app = express();
app.use(express.json());

dotenv.config()

conectarDB()

//Configurar CORS
const whiteList =[process.env.FRONTEND_URL, 'http://localhost:5173']

const corsOptions = {
  origin: function (origin, callback){
    if(whiteList.includes(origin)){
      //Puede consultar la API
      callback(null, true)
    } else {
      //No tiene permisos para consultar API
      callback(new Error('Error de CORS'))
    }
  }
}

app.use(cors(corsOptions))

//Routing
app.use('/api/usuarios', usuarioRoutes)
app.use('/api/proyectos', proyectoRoutes)
app.use('/api/tareas', tareaRoutes)


const PORT = process.env.PORT || 4000

const servidor = app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`)
})

//Sockect.io
// import http from 'http'
import { Server } from 'socket.io'

// const server = http.createServer(app)

const io = new Server(servidor, {
  pingTimeout: 60000,
  cors: {
    origin: process.env.FRONTEND_URL,
    // methods: ["GET", "POST"]
  }
});

io.on('connection', (socket) => {
  console.log('conectaado a socket.io')

  //definir los eventos de Socket
  socket.on('abrir proyecto', (proyectoId) => {
    socket.join(proyectoId)
  })

  socket.on('nueva tarea', (tarea) => {
    const proyecto = tarea.proyecto
    socket.to(proyecto).emit('tarea agregada', tarea)
  })

  socket.on('eliminar tarea', (tarea) => {
    const proyecto = tarea.proyecto
    socket.to(proyecto).emit('tarea eliminada', tarea)
  })

  socket.on('actualizar tarea', (tarea) => {
    const proyecto = tarea.proyecto._id
    socket.to(proyecto).emit('tarea actualizada', tarea)
  })

  socket.on('actualizar estado tarea', (tarea) => {
    const proyecto = tarea.proyecto._id;
    socket.to(proyecto).emit('estado tarea actualizado', tarea)
  });

  socket.on('agregar colaborador', (colaborador) => {
    console.log(colaborador)
    const proyecto = colaborador.proyecto
    socket.to(proyecto).emit('colaborador agregado', colaborador)
  });

  socket.on('eliminar colaborador', (informacion) => {
    const proyecto = informacion.idProyecto
    socket.to(proyecto).emit('colaborador eliminado', informacion)
  });
})