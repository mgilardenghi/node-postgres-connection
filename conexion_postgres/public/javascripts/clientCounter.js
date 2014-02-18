

/*******************************************************************
*  
*  Cliente Javascript que realiza la conexión a un web socket
*  para a través de éste recibir por parte del servidor
*  información en tiempo real sobre la cantidad de visitantes
*  de la aplicación. Una vez recibido este valor, lo actualiza
*  dinámicamente en el browser.
*  
********************************************************************/

var socket = io.connect(); 
var count = document.getElementById('count');  

socket.on('usersCounter', function (data)
{
	count.innerHTML = data.number;
});