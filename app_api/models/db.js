var mongoose = require( 'mongoose' );

var dbURI = 'mongodb://localhost/Loc8r'; //mongodb://username:password@localhost:27027/database

if (process.env.NODE_ENV === 'production') {
//dbURI = 'mongodb://<user>:<password>.@ds147044.mlab.com:47044/loc8r';process.env.MONGOLAB_URI;
	dbURI = process.env.MONGOLAB_URI;//MONGOLAB_URI es una variable de ENV creada en la nube
};//si esta en produccion se conecta a la db de la nube MLAB AWS

mongoose.connect(dbURI,{useMongoClient:true});

mongoose.connection.on('connected', function () {
console.log('Mongoose connected to ' + dbURI);
});
mongoose.connection.on('error',function (err) {
console.log('Mongoose connection error: ' + err);
});
mongoose.connection.on('disconnected', function () {
console.log('Mongoose disconnected');
});

gracefulShutdown = function (msg, callback) {
	mongoose.connection.close(function () {
	console.log('Mongoose disconnected through ' + msg);
	callback();
	});
};
// For nodemon restarts
process.once('SIGUSR2', function () {
	gracefulShutdown('nodemon restart', function () {
	process.kill(process.pid, 'SIGUSR2');
	console.log('Nodemon restarts');
	});
});
// For app termination
process.on('SIGINT', function() {
	gracefulShutdown('app termination', function () {
	process.exit(0);
	});
});
// For Heroku app termination
process.on('SIGTERM', function() {
	gracefulShutdown('Heroku app shutdown', function () {
	process.exit(0);
	});
});


require('./locations');
require('./users');//autenticar usuarions SPA MEAN STACK