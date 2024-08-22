import mongoose from "mongoose";
import colors from 'colors'

export const db = async() => {
  try {

    const db = await mongoose.connect(process.env.MONGO_URL)
    
    const url = `${db.connection.host}:${db.connection.port}`
    console.log(colors.green('MongoDb se conectó correctamente en', url));

  } catch (error) {
    console.log(colors.red(`Error: ${error}`))
    process.exit(1)
  }
}