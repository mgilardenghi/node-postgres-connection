
/*******************************************************************
*
*  Archivo de configuración que contiene el acceso a la base de
*  datos PostgreSQL, servicio SMTP de email, entre otras funciones
*  implementadas en el directorio ('/routes/user.js')
*
********************************************************************/

// MODULOS IMPLEMENTADOS

var postgreSQL = require('pg'),
    nodemailer = require("nodemailer");


// CONFIGURACIÓN DE LA BASE DE DATOS

// cliente postgreSQL
var client = new postgreSQL.Client(
{
    host : 'localhost',
    user : 'postgres',         // CAMBIAR POR UN USUARIO PROPIO (si no se quiere usar el usuario 'postgres' por defecto)
    password : 'my_password',  // CAMBIAR POR LA CONTRASEÑA PROPIA
    database : 'postgres',     // CAMBIAR LA BASE DE DATOS (si no se quiere usar la base 'postgres' por defecto) 
});

// conexión con la base de datos
client.connect( function(err)
{
	if(err)
  {
    return console.error( "Database failure. Connection to PostgreSQL could not be established!", err);
  }; 
  
  // creación de la tabla users para el registro de usuarios
  client.query( 'CREATE TABLE IF NOT EXISTS users( ' + 
                'ID SERIAL PRIMARY KEY, ' +
                'First_Name VARCHAR(20), ' +
                'Last_Name VARCHAR(20), ' +
                'Email VARCHAR(30), ' +
                'Password VARCHAR(15), ' +
                'Phone_Number VARCHAR(15))', function(err)
  {
    if(err)
    {
      return console.error('Database Error. Connection to PostgreSQL failed', err);
    }        
  }); 
});


// CONFIGURACION DEL SERVICIO SMTP

// configuración SMTP con email de origen
var smtpTransport = nodemailer.createTransport("SMTP",
{
	auth: 
    {
      user: 'my_email_account',   // CAMBIAR POR UNA CUENTA DE EMAIL PROPIA
      pass: 'my_email_password'   // CAMBIAR POR LA CONTRASEÑA PROPIA
    }
});

// envio de email a destino
function enviarMail(email, password)
{
  var mailOptions =
  {
    from: "My name <my_email_account>",   // CAMBIAR POR NOMBRE PROPIO
    to: email,
    subject: "Password Recovery",
    text: "Your password is:\t\t" + password
  };
  
  smtpTransport.sendMail( mailOptions, function(error, response)
  {
    if(error)
    {
      return false;
    }
    return true;
  });
};


// OTRAS FUNCIONES

// redirecciona a una ruta especificada
function render(dir, title, message, errors, res)
{
  res.render(dir, 
  { 
    title: title,
    message: message,
    errors: errors
  });  
};

// valida los datos ingresados en los formularios
function validateFormData(req, formName)
{
  if( formName == 'register')
  {
    req.checkBody( 'firstname', 'First_Name: invalid characters. only letters permitted.').isAlpha();
    req.checkBody( 'firstname', 'First_Name: up to 20 characters permitted.').len(1,20); 
    req.checkBody( 'lastname', 'Last_Name: invalid characters. only letters permitted.').isAlpha();
    req.checkBody( 'lastname', 'Last_Name: up to 20 characters permitted.').len(1,20);
    req.checkBody( 'email', 'Email: invalid characters. Look at the example above.').isEmail();
    req.checkBody( 'email', 'Email: up to 30 characters permitted.').len(0,30);
    req.checkBody( 'password', 'Password: Invalid characters. Numbers and Letters required.').isAlphanumeric();
    req.checkBody( 'password', 'Password: 5 to 15 characters required.').len(5,15);
    req.checkBody( 'phoneNumber', 'Phone_Number: Invalid characters. Only numbers permitted.').isNumeric();
    req.checkBody( 'phoneNumber', 'Phone_Number: 8 to 15 characters required.').len(8,15);
    return req.validationErrors();
  }
  if( formName == 'signin')
  {
    req.checkBody( 'email', 'Email: invalid characters. Look at the example above.').isEmail();
    req.checkBody( 'email', 'Email: up to 30 characters permitted.').len(0,30);
    req.checkBody( 'password', 'Password: Invalid characters. Numbers and Letters required.').isAlphanumeric();
    req.checkBody( 'password', 'Password: 5 to 15 characters required.').len(5,15);
    return req.validationErrors();
  }
  if( formName == 'passwordRecovery')
  {
    req.checkBody( 'email', 'Email: invalid characters. Look at the example above.').isEmail();
    req.checkBody( 'email', 'Email: up to 30 characters permitted.').len(0,30);
    return req.validationErrors();
  }
};

/* validationErrors() retorna un objeto del tipo:
  [
    {param: "email", msg: "Invalid email", value: "<received input>"},
    {param: "email", msg: "Invalid password", value: "<received input>"},}
  ]
*/


// EXPORTACIÓN DE FUNCIONES 

// permite que sean accedidas desde el exterior
module.exports.client = client;
module.exports.enviarMail = enviarMail;
module.exports.render = render;
module.exports.validateFormData = validateFormData;