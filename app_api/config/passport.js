var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var mongoose = require('mongoose');
var User = mongoose.model('User');


passport.use(new LocalStrategy({
		usernameField: 'email'
	},
	function(username, password, done) {
		User.findOne({ email: username }, function (err, user) {//metodo findOne aplicado al modelo USER
			if (err) { return done(err); }

			if (!user) {
				return done(null, false, {
					message: 'Incorrect username or password, Please try again.'
				});
			}
			if (!user.validPassword(password)) {
				return done(null, false, {
					message: 'Incorrect username or password, Please try again.P'
				});
			}
			return done(null, user);//devuelve el usuario en caso de no haber problemas de autenticacion
		});
	}
));