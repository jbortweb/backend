import mongoose from 'mongoose'

const reservaSchema = mongoose.Schema({
  services:[
    {
      type:mongoose.Schema.Types.ObjectId,
      ref :'Services'
    }
    ],
      date: {
        type: Date
      },
      time: {
      type: String
      },
      total: {
        type: Number
      },
      user:{
        type:mongoose.Schema.Types.ObjectId,
        ref :'User'
      }
})

const Reserva = mongoose.model('Reserva', reservaSchema)

export default Reserva