var passport = require('passport');
var mongoose = require('mongoose');
var User = mongoose.model('User');

var sendJSONresponse = function(res, status, content) {// convierto en formato json la respuesta
	res.status(status);
	res.json(content);
};

module.exports.register = function(req, res) {
	if(!req.body.name || !req.body.email || !req.body.password) {//primero se verifica si se enviaron todos los datos a la API
			sendJSONresponse(res, 400, {
				"message": "All fields required"
			});
			return;
	}
		var user = new User();//luego de la verificacion se instancia un nuevo usuario
		user.name = req.body.name;// a este usuario se le coloca el nombre enviado a la API
		user.email = req.body.email;//y el email enviado a la API
		user.setPassword(req.body.password);// para el password se usa el metodo setPassword del modelo USERS.JS que genera un HASH del password y se almacena
		user.save(function(err) {//se guarda el nuevo usuario en la db
			var token;
			if (err) {
				sendJSONresponse(res, 404, err);// en caso de error se envia el error
			} else {
				token = user.generateJwt();//se genera el token JWT para mantener la sesion en el SPA
				sendJSONresponse(res, 200, {//si no hubo error al guardar, se envia en formato JSON el token de sesion para este usuario
					"token" : token
				});
			}
		});
};

module.exports.login = function(req, res) {
	if(!req.body.email || !req.body.password) {//verificar que se enviaron todos los datos
		sendJSONresponse(res, 400, {
			"message": "All fields required"
		});
		return;
	}
	passport.authenticate('local', function(err, user, info){//se pasa el tipo y nombre de la estrategia y la funcion callback al metodo de autenticacion de passport
		var token;
		if (err) {
			sendJSONresponse(res, 404, err);//en caso de error se envia el error
			return;
		}
		if(user){// si Passport devuelve un usuario, se genera un token y se devuelve al explorador web
			token = user.generateJwt();
			sendJSONresponse(res, 200, {
				"token" : token
			});
		} else {
			sendJSONresponse(res, 401, info);//en caso de haber algun problema de autenticacion se envia un mensaje info con la respuesta
		}
	})(req, res);//se le pasa req y res para asegurarnos que passport.authenticate('local',callback)(req,res) tenga acceso a ellos por closure 
};