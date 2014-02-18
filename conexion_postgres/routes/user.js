
/*******************************************************************
*
*  Archivo que contiene las acciones a realizar por la aplicación
*  en respuesta a una solitud POST de de cliente. 
*
********************************************************************/

// MODULOS IMPORTADOS

var config = require('./config');


// MÉTODOS POST

// '/register' page
exports.registerUser = function(req, res)
{
  var dir = 'registerForm';
  var title = 'Create your account';
  var message ='';

  // validación de datos de registro de usuario
  var errors = config.validateFormData(req,'register'); 

  if(errors)
  {   
    // actualizo la página con los errores encontrados
    config.render(dir, title, message, errors, res);
    return console.log("Sign in validation error. Invalid input!")    
  }

  // Si los datos son válidos, verifico que el mail 
  // no haya sido registrado previamente por otro usuario
  var data = [];
  data.push(  req.body.firstname, 
              req.body.lastname, 
              req.body.email, 
              req.body.password, 
              req.body.phoneNumber);

  var query = 'SELECT * FROM users WHERE Email = ($1)';

  // se envía el email como parámetro para evitar inyección de sql.
  // Es decir, se toma cualquier contenido ingresado como un string
  // para evitar daños en la base de datos.
  config.client.query( query, [data[2]], function(error, result)   
  {     
    if(error)
    {
      message = "Database failure. Connection to PostgreSQL could not be established!";
      res.send(message);
      return console.error(message, error);     
    }	
      
    // si el mail ya fue registrado, la consulta anterior
    // devolverá 1 fila
    if(result.rowCount > 0)
    {
      // actualizo la página con el mensaje de error
      //message = 'User already exists. Type another email!'
      message = 'User already exists. Type another email!'
      config.render(dir, title, message, errors, res);
      return console.log(message);  
    }
    
    // Si no hubo errores, creo el usuario en la base de datos
    query = 'INSERT INTO users (First_Name, Last_Name, Email, Password, Phone_Number) ' + 
            'VALUES($1, $2, $3, $4, $5)';
  
    config.client.query( query, [data[0], data[1], data[2], data[3], data[4]], function(error)
    {
      if(error)
      {
        message = "Database failure. Connection to PostgreSQL could not be established!";
        console.error(message, error);
        return res.send(message);
      }

      // una vez creado el usuario, retorno a la página de inicio
      res.redirect('/');
      console.log('User Registered!');
    });
  });
};


//  '/signin' page
exports.loginUser = function(req, res)
{
  var dir = 'signinForm';
  var title = 'Sign in to your account';
  var message= '';
  
  // validación de datos de inicio de sesión
  var errors = config.validateFormData(req,'signin');

  if(errors)
  {   
    config.render(dir, title, message, errors, res);  
    return console.log("Sign in validation error. Invalid input!");
  }

  // Verifico que el email y el password existan en la base de datos.
  var email = req.body.email;
  var password = req.body.password;
  var query = 'SELECT * FROM users WHERE Email = ($1) AND Password = ($2)'; 

  config.client.query( query, [email, password], function(error, result)
  {     
    if(error)
    {
      message = "Database failure. Connection to PostgreSQL could not be established!";
      res.send(message);
      return console.error(message, error);
    }

    // si la consulta no devuelve resultado alguno significa
    // que el usuario ingresado no existe
    if(result.rowCount == 0)
    {
      message = 'User not found. Check the email or password!';
      config.render(dir, title, message, errors, res);  
      return console.log(message);
    }  

    // guardo el nombre del usuario para mostrarlo
    // en la pantalla de bienvenida
    var username = result.rows[0].first_name;       
    res.render('signoutForm', {user: username + '!'} );
    console.log("User signed in.");
  });    
};


// '/forgotPassword' page
exports.passwordRecovery = function(req, res)
{
  var dir = 'forgotPasswordForm';
  var title = 'Recover your password';
  var message= '';

  // valido el email ingresado para el envío de la contraseña
  var errors = config.validateFormData(req,'passwordRecovery');

  if(errors)
  {   
    config.render(dir, title, message, errors, res);  
    return console.log("Password Recovery validation error. Invalid input!");
  }

  // Verifico si el email existe en la base de datos
  var email = req.body.email;
  var query = 'SELECT Password FROM users WHERE Email = ($1)'; 

  config.client.query( query, [email], function(error, result)
  {
    if(error)
   	{
      message = "Database failure. Connection to PostgreSQL could not be established!";
      res.send(message);
   	  return console.error(message, error);
    } 

    if(result.rowCount == 0)
	  {
      message = 'User not found. Check the email!';
      config.render(dir, title, message, errors, res); 
      return console.log(message);
	  }
	  
    // Envío el password a la dirección de email ingresada   	
    var password = result.rows[0].password;

	  if(config.enviarMail(email, password))
    {
      message = "SMTP Failure. Password could not be sent!";
      res.send(message)
      return console.error(message);
    }
    
    // vuelvo a la página de inicio
    res.redirect('/');
    console.log("Password sent successfully!" );
	});
};