var mongoose = require('mongoose');
var Loc = mongoose.model('Location');


var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};
// CRUD

//
module.exports.locationsListByDistance = function(req,res){//query GET /api/locations/lng=valor&lat=valor2&maxDistance=valor3
	var lng = parseFloat(req.query.lng);
	var lat = parseFloat(req.query.lat);
	var maxDistance= parseFloat(req.query.maxDistance);
	var point = {
		type: "Point",
		coordinates: [lng, lat]
	};
	var options = {
		spherical: true,
		maxDistance: maxDistance,//theEarth.getRadsFromDistance(maxDistance),
		num : 10
	};

			console.log("longitud "+ lng);
			console.log("latitud "+ lat);
			console.log("Maxima distancia "+ options.maxDistance	);

	if ((!lng && lng!==0) || (!lat && lat!==0)|| !maxDistance) {//! significa que es undefine, cero, null o empty string por eso aqui se excluye el cero que es en el ecuador
		sendJSONresponse(res, 404, {
			"message": "lng, lat and maxDistance query parameters are required"
		});
		return;
	}

	Loc.geoNear(point, options, function (err, results, stats) {
		var locations = [];
		//console.log(results);


		results.forEach(function(doc) {
			locations.push({
				distance: doc.dis,//theEarth.getDistanceFromRads(doc.dis),
				name: doc.obj.name,
				address: doc.obj.address,
				rating: doc.obj.rating,
				facilities: doc.obj.facilities,
				_id: doc.obj._id
			});

		});
	sendJSONresponse(res, 200, locations);
	});
};

module.exports.locationsReadOne = function(req, res) {
	if (req.params && req.params.locationid) {
		Loc.findById(req.params.locationid)
		.exec(function(err, location) {
				if (!location) {
					sendJSONresponse(res, 404, {
					"message": "locationid not found"
				});
				return;
			} else if (err) {
				sendJSONresponse(res, 404, err);
				return;
			}
			sendJSONresponse(res, 200, location);
		});
	} else {
		sendJSONresponse(res, 404, {
			"message": "No locationid in request"
		});
	}
};

module.exports.locationsCreate = function(req, res) {
	console.log(parseFloat(req.body.lat) + ' ' + parseFloat(req.body.lng));//post en este caso los parametros se obtienen con el body del POST
	Loc.create({

		name: req.body.name,
		address: req.body.address,
		facilities: req.body.facilities.split(","),
		coords: [parseFloat(req.body.lat), parseFloat(req.body.lng)],
		openingTimes: [{
			days: req.body.days1,
			opening: req.body.opening1,
			closing: req.body.closing1,
			closed: req.body.closed1,
		}, {
			days: req.body.days2,
			opening: req.body.opening2,
			closing: req.body.closing2,
			closed: req.body.closed2,
		}]}, function(err, location) {
		if (err) {
			sendJSONresponse(res, 400, err);
		} else {
			sendJSONresponse(res, 201, location);
		}
	});
};


module.exports.locationsUpdateOne = function(req,res){
	if (!req.params.locationid) {
		sendJSONresponse(res, 404, {
			"message": "Not found, locationid is required"
		});
		return;
	}
	Loc
	.findById(req.params.locationid)
	.select('-reviews -rating')
	.exec(
		function(err, location) {
			if (!location) {
				sendJSONresponse(res, 404, {
					"message": "locationid not found"
				});
				return;
			} else if (err) {
				sendJSONresponse(res, 400, err);
				return;
			}
			location.name = req.body.name;
			location.address = req.body.address;
			location.facilities = req.body.facilities.split(",");
			console.log(req.body.lng + " " + req.body.lat);
			location.coords = [parseFloat(req.body.lng),parseFloat(req.body.lat)];
			location.openingTimes = [{
				days: req.body.days1,
				opening: req.body.opening1,
				closing: req.body.closing1,
				closed: req.body.closed1,
				}, {
				days: req.body.days2,
				opening: req.body.opening2,
				closing: req.body.closing2,
				closed: req.body.closed2,
			}];
			location.save(function(err, location) {
				if (err) {
					sendJSONresponse(res, 404, err);
				} else {
					sendJSONresponse(res, 200, location);
				}
			});
		}
	);

};

module.exports.locationsDeleteOne = function(req, res) {
	var locationid = req.params.locationid;
	if (locationid) {
		Loc
		.findByIdAndRemove(locationid)
		.exec(
		function(err, location) {
			if (err) {
				sendJSONresponse(res, 404, err);
			return;
			}
				sendJSONresponse(res, 204, null);
		});
	} else {
		sendJSONresponse(res, 404, {
			"message": "No locationid"
		});
	}
};
