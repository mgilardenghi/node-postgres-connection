
/*******************************************************************
*
*  Archivo principal con la configuración general de la 
*  aplicación web Express y del servidor HTTP
*
********************************************************************/

// MODULOS IMPLEMENTADOS

var express = require('express'),
    routes = require('./routes'),
    user = require('./routes/user'),
    path = require('path'),
    http = require('http'),
    io = require('socket.io');
    expressValidator = require('express-validator');


// CONFIGURACIÓN DE LA APLICACIÓN EXPRESS

var app = express();

app.configure(function()
{
  app.set('port', process.env.PORT || 3000);
  app.set('views', path.join(__dirname, 'views'));
  app.set('view engine', 'jade');

  app.use(express.favicon());     // agregado de imagenes       
  app.use(express.logger('dev'));
  app.use(express.json());        // reemplazo de bodyparser
  app.use(express.urlencoded());  // reemplazo de bodyparser
  app.use(expressValidator());
  app.use(express.methodOverride());
  app.use(app.router);                 
  app.use(express.static(path.join(__dirname, 'public')));
});

// for development only
app.configure('development', function()
{
  app.use(express.errorHandler());
});

// configuración de acceso a las rutas ('/routes/index.js')
app.get('/', routes.getHomePage);
app.get('/register', routes.getRegisterPage);
app.get('/signin', routes.getSigninPage);
app.get('/forgotPassword', routes.getForgotPasswordPage);

// configuración de solicitudes POST ('/routes/user.js')
app.post('/register', user.registerUser);
app.post('/signIn', user.loginUser);
app.post('/forgotPassword', user.passwordRecovery);


// CONFIGURACIÓN DEL SERVIDOR HTTP

var server = http.createServer(app)

// implementación de web sockets para la comunicación 
// bidireccional en tiempo real entre servidor y clientes
var io = io.listen(server);

// contador para el registro en tiempo real de la
// cantidad de clientes coenctados
var clientCounter = 0;


// INICIO DEL SERVIDOR

server.listen(app.get('port'), function()
{
  // escucha de conexión y desconexión de clientes
  io.sockets.on('connection', function (socket) 
  {  
    clientCounter++;
    io.sockets.emit('usersCounter', { number: clientCounter });
    console.log("User connected!");
    
    socket.on('disconnect', function () 
    { 
      clientCounter--;
      console.log("user disconnected!"); 
      io.sockets.emit('usersCounter', { number: clientCounter });  
    }); 
    // si quisiese enviar la cantidad sólo al último cliente conectado:
    // socket.emit(...)    
    // Si quisiese enviarlo a todos menos al último cliente conectado:
    // socket.broadcast.emit(...);
  });
  console.log('Express server listening on port ' + app.get('port'));
});