var request = require('request');//modulo para conectarme con la API


var apiOptions = {
  server : "http://localhost:3000"
};
if (process.env.NODE_ENV === 'production') {
  apiOptions.server = "https://arcane-cliffs-63334.herokuapp.com/";
}

var renderHomepage = function(req, res,responseBody){
	var message;
		if (!(responseBody instanceof Array)) {//si la respuesta no es un arreglo
			message = "API lookup error";
			responseBody = [];//coloca el arreglo a vacio
		} else {//si la respuesta es un arreglo
			if (!responseBody.length) {//pero ese arreglo esta vacio
				message = "No places found nearby";
			}
		}
	res.render('locations-list',{ 
		title:'Loc8r - find a place to work with wifi',
		pageHeader: {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		},
		sidebar: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",
		locations:responseBody,
		message: message
		/*locations: [{
			name: 'Starcups',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 3,
			facilities: ['Hot drinks', 'Food', 'Premium wifi'],
			distance: '100m'
		},
		{
			name: 'Cafe Hero',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 4,
			facilities: ['Hot drinks', 'Food', 'Premium wifi'],
			distance: '200m'
		},
		{
			name: 'Burger Queen',
			address: '125 High Street, Reading, RG6 1PS',
			rating: 2,
			facilities: ['Food', 'Premium wifi'],
			distance: '250m'

		}]*/
	});
}

var _formatDistance = function (distance) {
	var numDistance, unit;
	if (distance > 1000) {
		numDistance = parseFloat(distance/1000).toFixed(1);
		unit = ' km';
	} else {
		numDistance = parseInt(distance,10);
		unit = ' m';
	}
	return numDistance + unit;
};
/* GET 'home' page */
module.exports.homeList = function(req,res){
	var requestOptions, path;
	path = '/api/locations';
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {},
		qs : {
			lng : 0,//-0.7704837,//-0.7992599,
			lat : 0,//51.4564298,//51.378091,
			maxDistance : 5900000
		}
	};

	request(
		requestOptions,
		function(err, response, body) {
			var i,data,dataLength;
			data=body;
			if(response.statusCode === 200 && data.length){
				for (i=0,dataLength=data.length; i<dataLength; i++) {
					data[i].distance = _formatDistance(data[i].distance);
				}
			}
			renderHomepage(req, res, data);
		}
	);
		
		
};

/* GET 'Location Info' page 
module.exports.locationInfo = function(req,res){
	res.render('location-info',{ title:'Location Info' });
};*/
var _showError = function (req, res, status) {
	var title, content;
	if (status === 404) {
		title = "404, page not found";
		content = "Oh dear. Looks like we can't find this page. Sorry.";
	} else {
		title = status + ", something's gone wrong";
		content = "Something, somewhere, has gone just a little bit wrong.";
	}
	res.status(status);
	res.render('generic-text', {
		title : title,
		content : content
	});
};
var getLocationInfo = function(req,res,callback){

	var requestOptions, path;
	path = "/api/locations/" + req.params.locationid;
	requestOptions = {
		url : apiOptions.server + path,
		method : "GET",
		json : {}
	};
	request(
		requestOptions,
		function(err, response, body) {
			var data = body;
			if (response.statusCode === 200) {//esto se hace ya que la vista necesita los valores de lng y lat en formato objeto y no formato array que es como lo devuelve la API
				data.coords = {//convirtiendo array en object
					lng : body.coords[0],
					lat : body.coords[1]
				};
			}else {
				_showError(req, res, response.statusCode);
			}
			callback(req, res,data);//funcion que se ejecutara al final de recuperar la data de la DB 
		}
	);

};

var renderDetailPage= function(req,res,locDetail){
	res.render('location-info', {
		title: locDetail.name,
		pageHeader: {title: locDetail.name},
		sidebar: {
			context: 'is on Loc8r because it has accessible wifi and space to sit down with your laptop and get some work done.',
			callToAction: 'If you\'ve been and you like it - or if you don\'t -please leave a review to help other people just like you.'
			},
		location: locDetail
	});
};



module.exports.locationInfo = function(req, res){
	getLocationInfo(req,res,function(req,res,data){
		renderDetailPage(req,res,data);
	});
};


/* GET 'Add Review' page */

var renderReviewForm = function (req, res,locDetail){
	res.render('location-review-form',{
	 title:'Review ' + locDetail.name + ' on Loc8r',
	 pageheader: 
	 {
	 	title: 'Review ' + locDetail.name
	 },
	 error: req.query.err
		  });
};



module.exports.addReview = function(req,res){
	getLocationInfo(req,res,function(req, res,data){
		renderReviewForm(req, res,data);
	});	
};

module.exports.doAddReview = function(req,res){
	var requestOptions, path, locationid, postdata;
	locationid = req.params.locationid;
	path = "/api/locations/" + locationid + '/reviews';
	postdata = {
		author: req.body.name,
		rating: parseInt(req.body.rating, 10),
		reviewText: req.body.review
	};
	requestOptions = {
		url : apiOptions.server + path,
		method : "POST",
		json : postdata
	};

	if(!postdata.author || !postdata.rating || !postdata.reviewText){

		res.redirect('/addReview/' + locationid + '?err=val');
		console.log("Error antes del request a la API");

	} else {
		request(
					requestOptions,
					function(err, response, body) {
						console.log("se ejecuto una peticion a la  API");
						if (response.statusCode === 201) {//201 es la respuesta correcta cuando se postea bien en la db
							res.redirect('/location/' + locationid);
						} else if (response.statusCode === 400 && body.name && body.name === "ValidationError" ) {
							res.redirect('/addReview/' + locationid + '?err=val');
						}else {
							_showError(req, res, response.statusCode);
						}
					}
				);
	}
};



