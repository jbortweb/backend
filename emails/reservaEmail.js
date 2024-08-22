import { createTransport } from "../config/nodemail.js";

export async function sendEmailNuevaReserva({date,time}) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  //Enviar emails

  const info = await transporter.sendMail({
    from: "JR Llansola <citas@correo.com",
    to: "jrllansola@correo.com",
    subject: "JR Llansola - Nueva cita",
    text: "JR Llansola - Nueva cita",
    html:`<p>Hola: Tienes una nueva cita </p>
    <p>La cita será el día: ${date} a las ${time} horas</p>`
  })

  console.log('Mensaje enviado', info.messageId);
}

export async function sendEmailUpdateReserva({date,time}) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  //Enviar emails

  const info = await transporter.sendMail({
    from: "JR Llansola <citas@correo.com",
    to: "jrllansola@correo.com",
    subject: "JR Llansola - Cita actualizada",
    text: "JR Llansola - Cita actualizada",
    html:`<p>Hola: Un usuario ha modificado una cita </p>
    <p>La nueva cita será el día: ${date} a las ${time} horas</p>`
  })

  console.log('Mensaje enviado', info.messageId);
}

export async function sendEmailDeleteReserva({date,time}) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  //Enviar emails

  const info = await transporter.sendMail({
    from: "JR Llansola <citas@correo.com",
    to: "jrllansola@correo.com",
    subject: "JR Llansola - Cita cancelada",
    text: "JR Llansola - Cita cancelada",
    html:`<p>Hola: Un usuario ha cancelado una cita </p>
    <p>La cita cancelada era el día: ${date} a las ${time} horas</p>`
  })

  console.log('Mensaje enviado', info.messageId);
}