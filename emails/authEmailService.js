import { createTransport } from "../config/nodemail.js";

export async function sendEmailVerification({name,email,token}) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  //Enviar emails

  const info = await transporter.sendMail({
    from: "Jbortweb <jbortweb@gmail.com",
    to: email,
    subject: "Jbortweb - Confirma tu cuenta",
    text: "Jbortweb - Confirma tu cuenta",
    html:`<p>Hola: ${name}, confirma tu cuenta en Jbortweb </p>
    <p>Tu cuenta esta casi lista, presiona el enlace para activarla</p>
    <a href="${process.env.FRONTEND_URL}/auth/confirmar-cuenta/${token}">Confirmar cuenta</a>
    <p>Si no creaste esta cuenta puedes ignorar este mensaje</p>`
  })

  console.log('Mensaje enviado', info.messageId);
}

export async function sendEmailPasswordReset({name,email,token}) {
  const transporter = createTransport(
    process.env.EMAIL_HOST,
    process.env.EMAIL_PORT,
    process.env.EMAIL_USER,
    process.env.EMAIL_PASS
  )

  //Enviar emails

  const info = await transporter.sendMail({
    from: "Jbortweb <jbortweb@gmail.com",
    to: email,
    subject: "Jbortweb - Restablece tu contraseña",
    text: "Jbortweb - Restablece tu contraseña",
    html:`<p>Hola: ${name}, has solicitado reestablecer tu contraseña</p>
    <p>Presiona al siguiente enlace para generar una nueva contraseña</p>
    <a href="${process.env.FRONTEND_URL}/auth/olvide-password/${token}">Generar contraseña</a>
    <p>Si no solicitaste esto, puedes ignorar este mensaje</p>`
  })
}