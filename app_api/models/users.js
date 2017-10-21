var mongoose = require( 'mongoose' );
var crypto = require('crypto');// para generar el salt y el hash de los password
var jwt = require('jsonwebtoken');//para manejar las sesiones seguras

var userSchema = new mongoose.Schema({
	email: {
		type: String,
		match:[/.+\@.+\..+/, "Por favor inserte una direccion valida de correo"],
		unique: true,
		required: true
	},
		name: {
		type: String,
		required: true
	},
	hash: String,
	salt: String
});

userSchema.methods.setPassword = function(password){//toma el password por primera vez , genera un salt y junto al password genera un hash para almacenarlo en la db
	this.salt = crypto.randomBytes(16).toString('hex');//el salt sera una palabra ramdom de 16 byte
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000,64).toString('hex');//estandar password-based key derivation function 2 PARA GENERAR EL HASH
};

userSchema.methods.validPassword = function(password) {//
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	return this.hash === hash;//DEVUELVE TRUE SI EL HASH GENERADO COINCIDE CON EL HASH SETEADO
};

userSchema.methods.generateJwt = function() {
	var expiry = new Date();//expity es seteando a la hora y dia en el momneto de generar el token
	expiry.setDate(expiry.getDate() + 7);//se le suma 7 dias para setear el momento de expiracion
	return jwt.sign({//se genera el token generando la firma o signature (HEADER.PAYLOAD.SIGNATURE este es el esquema del token)
					//para ello se pasa el id el email el nombre y la fecha , mas la palabra secreta que solo debe residir en el servidor
		_id: this._id,
		email: this.email,
		name: this.name,
		exp: parseInt(expiry.getTime() / 1000),
	}, process.env.JWT_SECRET );//aqui va el secreto que se unsara como semilla para generar el hash del signature previamente almacenado en .env
};



mongoose.model('User',userSchema);