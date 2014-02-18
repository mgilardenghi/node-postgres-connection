/*******************************************************************
*
*  Archivo de configuración que redirecciona a la ruta solicitada
*  por el cliente, método GET.
*
********************************************************************/

// '/home' page -->  archivo: /views/home.jade
exports.getHomePage = function(req, res)
{
	res.render('home', 
	{ 
		title: 'My Express Web App',
		message: '',
		errors: {} 
	});
};


// '/register' page -->  archivo: /views/registerForm.jade
exports.getRegisterPage = function(req, res)
{
 	res.render('registerForm',
 	{ 
		title: 'Create your account',
		message: '',
		errors: {} 
	});
};


// '/signin' page -->  archivo: /views/signinForm.jade
exports.getSigninPage = function(req, res)
{
	res.render('signinForm',
	{ 
		title: 'Sign in to your account',
		message: '',
		errors: {} 
	});
};


// '/forgotPassword' page -->  archivo: /views/forgotPasswordForm.jade
exports.getForgotPasswordPage = function(req, res)
{
	res.render('forgotPasswordForm',
	{ 
		title: 'Recover your password',
		message: '',
		errors: {} 
	});
};