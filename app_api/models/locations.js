var mongoose = require('mongoose');

var openingTimeSchema = new mongoose.Schema({
	days: {type: String, required: true},
	opening: String,
	closing: String,
	closed: {type: Boolean, required: true}
});

var reviewSchema = new mongoose.Schema({
	author: {type: String, required: true},
	rating: {type: Number, required: true, min: 0, max: 5},
	reviewText: {type: String, required: true},
	createdOn: {type: Date, "default": Date.now}
});

var locationSchema = new mongoose.Schema({
	name: {type:String, required: true},//nombre obligatorio
	address: String,
	rating: {type:Number, "default": 0, min:0,max:5},// entre comillas por ser una palabra reservada de JAVASCRIPT
	facilities: [String],
	coords: {type:[Number],index:'2dsphere',required: true},
	openingTimes: [openingTimeSchema],
	reviews: [reviewSchema]
});

mongoose.model('Location', locationSchema);	//el esquema locationSchema se compila en el modelo Location 
											//y se almacena en la DB en un documento locations por default
											// una version en minuscula y plural del nombre del modelo