import Reserva from "../models/Reserva.js";
import { endOfDay, isValid, parse, startOfDay } from "date-fns";
import { validateObjectId, handleNotFoundError, formatDate } from "../helpers/index.js";
import { sendEmailDeleteReserva, sendEmailNuevaReserva, sendEmailUpdateReserva } from "../emails/reservaEmail.js";

//Almacenar citas

const createReserva = async (req, res) => {
  const reserva = req.body;
  reserva.user = req.user._id.toString();

  try {
    const newReserva = new Reserva(reserva);

     const result = await newReserva.save();

    await sendEmailNuevaReserva({
      date : formatDate(result.date),
      time : result.time
    })
    
    res.json({
      msg: "Cita Almacenada Correctamente",
    });
  } catch (error) {
    console.log(error);
  }
};

//Consulta citas por fecha

const getReservaDate = async (req, res) => {
  const { date } = req.query;
  const parsedDate = parse(date, "dd/MM/yyyy", new Date());
  const newDate = new Date(
    Date.UTC(
      parsedDate.getFullYear(),
      parsedDate.getMonth(),
      parsedDate.getDate()
    )
  );

  if (!isValid(newDate)) {
    const error = new Error("La fecha es incorrecta");
    return res.status(400).json({ msg: error.message });
  }

  const isoDate = newDate.toISOString();

  const reservas = await Reserva.find({
    date: {
      $gte: startOfDay(new Date(isoDate)),
      $lte: endOfDay(new Date(isoDate)),
    },
  }).select("time");
  res.json(reservas);
};

//Editar reservas

const getReservasById = async (req, res) => {
  const { id } = req.params;

  //validar por object id

  if (validateObjectId(id, res)) return;

  //Validar que exista

  const reserva = await Reserva.findById(id).populate("services");

  if (!reserva) {
    return handleNotFoundError("La cita no existe", res);
  }

  //Comprobar que el cliente y el que consulta sea el mismo id

  if (reserva.user.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes los permisos");
    return res.status(403).json({ msg: error.message });
  }

  //Retornar la cita

  res.json(reserva);
};

const updateReserva = async (req, res) => {
  const { id } = req.params;

  //validar por object id

  if (validateObjectId(id, res)) return;

  //Validar que exista

  const reserva = await Reserva.findById(id).populate("services");

  if (!reserva) {
    return handleNotFoundError("La cita no existe", res);
  }

  //Comprobar que el cliente y el que consulta sea el mismo id

  if (reserva.user.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes los permisos");
    return res.status(403).json({ msg: error.message });
  }

  //Retornar la cita
  const {date, time, total, services} = req.body
  reserva.date = date
  reserva.time = time
  reserva.total = total
  reserva.services = services

  try {
    const result = await reserva.save()

    await sendEmailUpdateReserva({
      date : formatDate(result.date), 
      time: result.time
    })

    res.json({
      msg:'Cita actualizada correctamente'
    })
  } catch (error) {
    console.log(error);    
  }
};

const deleteReserva = async(req, res) => {
  const { id } = req.params;

  //validar por object id

  if (validateObjectId(id, res)) return;

  //Validar que exista

  const reserva = await Reserva.findById(id).populate("services");

  if (!reserva) {
    return handleNotFoundError("La cita no existe", res);
  }

  //Comprobar que el cliente y el que consulta sea el mismo id

  if (reserva.user.toString() !== req.user._id.toString()) {
    const error = new Error("No tienes los permisos");
    return res.status(403).json({ msg: error.message });
  }

  try {
    const result = await reserva.deleteOne()

    await sendEmailDeleteReserva({
      date : formatDate(reserva.date), 
      time: reserva.time
    })
    res.json({msg:'Cita Cancelada Exitosamente'})

  } catch (error) {
    console.log(error);
    
  }
}

export { createReserva, getReservaDate, getReservasById, updateReserva, deleteReserva };
