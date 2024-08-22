import User from '../models/User.js'
import { sendEmailPasswordReset, sendEmailVerification } from '../emails/authEmailService.js'
import { generateJWT, uniqueId } from '../helpers/index.js'

const register = async (req, res) => {

  //Validamos que existan datos

  if (Object.values(req.body).includes('')) {
    const error = new Error('Todos los campos son obligatorios')

    return res.status(400).json({ msg: error.message })
  }

  //Evitar registros duplicados

  const { name, email, password } = req.body
  const userExist = await User.findOne({ email })

  if (userExist) {
    const error = new Error('Usuario ya registrado')
    return res.status(400).json({ msg: error.message })
  }

  //Validar password

  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[<>@$!%*?&])[A-Za-z\d<>@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) {
    const error = new Error('La contraseña debe tener al menos 8 caracteres, incluir letras, números y símbolos');
    return res.status(400).json({ msg: error.message });
  }


  try {
    const user = new User(req.body)
    const result = await user.save()

    //Enviar token para verificar email de usuario

    const { name, email, token } = result

    sendEmailVerification({ name, email, token })

    res.json({
      msg: "La cuenta se creo correctamente, revisa tu email"
    })

  } catch (error) {
    console.log(error);
  }
}

//Verificar token

const verifyAccount = async (req, res) => {
  const { token } = req.params
  const user = await User.findOne({ token })

  if (!user) {
    const error = new Error('Hubo un error, token no valido')
    return res.status(401).json({ msg: error.message })
  }
  // Si el token es valido, confirmar la cuenta y borrar token
  try {
    user.verified = true
    user.token = ''
    await user.save()
    res.json({ msg: 'Usuario confirmado correctamente' })
  } catch (error) {
    console.log(error);
  }
}

//Comprobar usuario

const login = async (req, res) => {
  const { email, password } = req.body

  //Revisar que el usuario exista
  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('El usuario no existe')
    return res.status(401).json({ msg: error.message })
  }

  //Revisar que el usuario este confirmado
  if (!user.verified) {
    const error = new Error('Tu cuenta no ha sido confirmada, revisa tu correo')
    return res.status(401).json({ msg: error.message })
  }

  //Revisar password

  if (await user.checkPassword(password)) {

    //Si pasa las validaciones llamamos a la funcion para que nos genere un json web token
    const token = generateJWT(user._id)

    res.json({ token })
  } else {
    const error = new Error('La contraseña es incorrecta')
    return res.status(401).json({ msg: error.message })
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body

  //Comprobar si existe el usuario

  const user = await User.findOne({ email })
  if (!user) {
    const error = new Error('El usuario no existe')
    return res.status(404).json({ msg: error.message })
  }

  try {
    user.token = uniqueId()
    const result = await user.save()

    await sendEmailPasswordReset({
      name: result.name,
      email: result.email,
      token: result.token
    })

    res.json({
      msg: 'Hemos enviado un email con las instrucciones'
    })
  } catch (error) {
    console.log(error);

  }
}

const verifyPasswordResetToken = async (req, res) => {
  const {token} = req.params

  const isValidToken = await User.findOne({ token })
  if (!isValidToken) {
    const error = new Error('Hubo un error, Token no valido')
    return res.status(400).json({ msg: error.message })
  }
  return res.json({ msg: 'Token valido' })
}

const updatePassword = async (req, res) => {
  const {token} = req.params

  const user = await User.findOne({ token })
  if (!user) {
    const error = new Error('Hubo un error, Token no valido')
    return res.status(400).json({ msg: error.message })
  }
  const {password} = req.body

  try {
    user.token =''
    user.password = password
    await user.save()
    res.json({
      msg:'Contraseña modificada correctamente'
    })

  } catch (error) {
    console.log(error);
    
  }
}

const user = async (req, res) => {
  const { user } = req
  res.json(
    user
  )
}


const admin = async (req, res) => {
  const { user } = req
  if(!user.admin){
    const error = new Error('Acción no válida')
    return res.status(403).json({msg: error.message})
  }
  
  res.json(
    user
  )
}

export {
  register,
  verifyAccount,
  login,
  user,
  forgotPassword,
  verifyPasswordResetToken,
  updatePassword,
  admin
}