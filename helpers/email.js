import nodemailer from 'nodemailer'

export const emailRegistro = async (datos) => {
  console.log(datos)
  const { nombre, email, token } = datos;
  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //Información del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Confirma tu cuenta',
    text: 'Comprueba tu cuenta en UpTask',
    html: `

    <p>Hola  ${nombre}, comprueba tu cuenta en UpTask</p>
    <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace:

    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
    </p>
    <p>Si no creaste una cuenta, por favor omite este mensaje</p>
    `
  })
}

export const emailRecuperarClave = async (datos) => {

  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  //Información del email
  const info = await transport.sendMail({
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Restablecer tu contraseña',
    text: 'Sigue las instrucciones para restablecer tu contraseña',
    html: `

    <p>Hola  ${nombre}, has solicitado restablecer tu password</p>

    <p>Sigue el siguiente enlace para generar una nueva contraseña:

    <a href="${process.env.FRONTEND_URL}/olvide-password/${token}">Nueva contraseña</a>
    </p>
    `
  })
}