import Reserva from "../models/Reserva.js";

const getUserReservas = async (req, res) => {
  const {user} = req.params

  try {

    if( user !== req.user._id.toString()){
      const error = new Error('Acceso denegado')
      return res.status(400).json({msg: error.message})
    }
    const query = req.user.admin ? 
      {date: { $gte : new Date()}} : 
      {user, date: { $gte : new Date()}}
      
    const reservas = await Reserva
      .find(query)
      .populate('services')
      .populate({path:'user', select:'name email'})
      .sort({date:'asc', time:'asc'})

    res.json(reservas)
  } catch (error) {
    console.log(error);
    
  }  
}

export {
  getUserReservas
}