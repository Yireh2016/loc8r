var express = require('express');
var router = express.Router();
var jwt = require('express-jwt');//middleware que permite autenticar al usuario antes de ir al controlador
var auth = jwt({//necesita dos parametros para configurarlo el secreto para generar los token
	secret: process.env.JWT_SECRET,//secreto
	userProperty: 'payload'//the name of the property we want to add to the req object to hold the payload. por default es user pero se cambia para no confundirlo con el user del modelo de la db
});
var ctrlLocations = require('../controllers/locations');//controlador donde estaran los metodos referentes a la logica de las localidades
var ctrlReviews = require('../controllers/reviews');// controlador donde reside la logica de los reviews
var ctrlAuth = require('../controllers/authentication');//controlador donde se maneja la logica de la autenticacion, login y sign in
// locations
router.get('/locations', ctrlLocations.locationsListByDistance);
router.get('/locations/:locationid', ctrlLocations.locationsReadOne);

router.post('/locations',ctrlLocations.locationsCreate);
router.put('/locations/:locationid', ctrlLocations.locationsUpdateOne);
router.delete('/locations/:locationid', ctrlLocations.locationsDeleteOne);


// reviews
router.get('/locations/:locationid/reviews/:reviewid',ctrlReviews.reviewsReadOne);
//rutas autenticadas, solo usuarios autorizados podran ver estas rutas
router.post('/locations/:locationid/reviews',auth, ctrlReviews.reviewsCreate);
router.put('/locations/:locationid/reviews/:reviewid', auth ,ctrlReviews.reviewsUpdateOne);
router.delete('/locations/:locationid/reviews/:reviewid', auth , ctrlReviews.reviewsDeleteOne);

/*rutas sin autenticacion el publico en general puede crear comentarios, editarlas y eliminarl0s
	router.post('/locations/:locationid/reviews', ctrlReviews.reviewsCreate);
	router.put('/locations/:locationid/reviews/:reviewid',ctrlReviews.reviewsUpdateOne);
	router.delete('/locations/:locationid/reviews/:reviewid',ctrlReviews.reviewsDeleteOne);
*/


// Auntenticacion

router.post('/register', ctrlAuth.register);//sign in o registro de usuarios
router.post('/login', ctrlAuth.login);// login o inicio de sesion
// NOTA: a todas las rutas se le obvia /api al inicio de la definicion de ruta porque ya se esta colocando en el require en app.js
//app.use('/api', routesApi);
module.exports = router;