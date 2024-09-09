import express from 'express'
import dotenv from 'dotenv'
import colors from 'colors'
import cors from 'cors'
import {db} from './config/db.js'
import servicesRoutes from './routes/servicesRoute.js'
import authRoutes from './routes/authRoute.js'
import reservaRoutes from './routes/reservaRoutes.js'
import userRoutes from './routes/userRoutes.js'


//Cargar variables de entorno

dotenv.config()

//Configurar la app

const app = express()

//Leer datos via body
app.use(express.json())

//conectar a db

db()

//configurar cors

const whiteList = [process.env.FRONTEND_URL]

/* const corsOptions = {
  origin: function(origin, callback) {
    if (whiteList.includes(origin)) {
      callback(null, true)
    }else{
      callback(new Error('Error de CORS'))
    }
  }
} */
app.use(cors(/* corsOptions */))

//Definir las rutas
app.use('/api/services', servicesRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/reservas', reservaRoutes)
app.use('/api/users', userRoutes)

//Definir un puerto

const PORT = process.env.PORT || 4000

//Arrancar la app

app.listen(PORT,()=> {
  console.log(colors.blue("El servidor se esta ejecutando en el puerto:", colors.blue.bold(PORT)));
})