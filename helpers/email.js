import nodemailer from 'nodemailer'

export const emailRegistro = async (datos) => {

  const { nombre, email, token } = datos;
  // Definimos el transporter
  const transporter = nodemailer.createTransport({
      service: 'Gmail',
      auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
  });
  // Definimos el email
  const mailOptions = {
    from: '"UpTask - Administrador de Proyectos" <cuentas@uptask.com>',
    to: email,
    subject: 'UpTask - Confirma tu cuenta',
    text: 'Comprueba tu cuenta en UpTask',
    html: `

    <p>Hola  <b>${nombre}</b>, comprueba tu cuenta en UpTask</p>
    <p>Tu cuenta ya está casi lista, solo debes comprobarla en el siguiente enlace:

    <a href="${process.env.FRONTEND_URL}/confirmar/${token}">Comprobar cuenta</a>
    </p>
    <p>Si no creaste una cuenta, por favor omite este mensaje</p>
    `
  };
  // Enviamos el email
  transporter.sendMail(mailOptions, function(error, info){
      if (error){
          console.log(error);
          // res.send(500, err.message);
      } else {
          console.log("Email sent");
          // res.status(200).jsonp(req.body);
      }
  });
}

export const emailRecuperarClave = async (datos) => {

  const { nombre, email, token } = datos;

  const transport = nodemailer.createTransport({
    service: 'Gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        },
        tls: {
          rejectUnauthorized: false
        }
  });

  const mailOptions = {
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
  };
  // Enviamos el email
  transport.sendMail(mailOptions, function(error, info){
    if (error){
        console.log(error);
        // res.send(500, err.message);
    } else {
        console.log("Email sent");
        // res.status(200).jsonp(req.body);
    }
  });
};