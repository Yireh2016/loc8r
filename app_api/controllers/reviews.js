var mongoose = require('mongoose');
var Loc = mongoose.model('Location');

var sendJSONresponse = function(res, status, content) {
	res.status(status);
	res.json(content);
};

module.exports.reviewsCreate = function(req,res){
	var locationid = req.params.locationid;
	if (locationid) {
		Loc
		.findById(locationid)
		.select('reviews').exec(
			function(err, location) {//location viene del findById
				if (err) {
					sendJSONresponse(res, 400, err);
				}else {
					doAddReview(req, res, location);
				}
			}
		);
	} else {
		sendJSONresponse(res, 404, {
			"message": "Not found, locationid required"
		});
	}

};


var doAddReview = function(req, res, location) {
  if (!location) {
    sendJSONresponse(res, 404, "locationid not found");
  } else {
    location.reviews.push({//los reviews son arreglos por ende con el comando push se agrega un nuevo objeto review al arreglo
      author: req.body.author,
      rating: req.body.rating,
      reviewText: req.body.reviewText
    });

    location.save(function(err, location) {//se salva el nuevo review y ademas se modifica la respuesta a enviar por la API
      var thisReview;
      if (err) {// si hay un error de validacion 
        console.log(err);
        sendJSONresponse(res, 400, err);
      } else {
        updateAverageRating(location._id);
        thisReview = location.reviews[location.reviews.length - 1];//se escoge unicamente el review que se acaba de salvar
        sendJSONresponse(res, 201, thisReview);//se envia la respuesta
      }
    });
  }
};

var updateAverageRating = function(locationid) {
  console.log("Update rating average for", locationid);
  Loc
    .findById(locationid)
    .select('reviews')
    .exec(
      function(err, location) {
        if (!err) {
          doSetAverageRating(location);
        }
      });
};

var doSetAverageRating = function(location) {
  var i, reviewCount, ratingAverage, ratingTotal;
  if (location.reviews && location.reviews.length > 0) {
    reviewCount = location.reviews.length;
    ratingTotal = 0;
    for (i = 0; i < reviewCount; i++) {
      ratingTotal = ratingTotal + location.reviews[i].rating;
    }
    ratingAverage = parseInt(ratingTotal / reviewCount, 10);
    location.rating = ratingAverage;
    location.save(function(err) {
      if (err) {
        console.log(err);
      } else {
        console.log("Average rating updated to", ratingAverage);
      }
    });
  }
};





module.exports.reviewsReadOne = function(req,res){
	if (req.params && req.params.locationid && req.params.reviewid) {
		Loc.findById(req.params.locationid)
		.select('name reviews')
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

			var response, review;

			if (location.reviews && location.reviews.length > 0) {
				review = location.reviews.id(req.params.reviewid);//el metodo ID ayuda a encontrar un subdocumento por ID
				console.log("id del review " + req.params.reviewid+"\n review " + review );
					if (!review) {
						sendJSONresponse(res, 404, {
							"message": "reviewid not found"
						});
				} else {
					response = {
						location : {
							name : location.name,
							id : req.params.locationid
						},
						review : review
					};
					sendJSONresponse(res, 200, response);
				}
			} else {// en caso de no existir ningun review
				sendJSONresponse(res, 404, {
					"message": "No reviews found"
				});
			}
		});
	} else {//en caso de no existir los id en la ruta
			sendJSONresponse(res, 404, {
			"message": "Not found, locationid and reviewid are both required"
		});
	}
};
module.exports.reviewsUpdateOne = function(req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
    .exec(
      function(err, location) {
        var thisReview;
        if (!location) {
          sendJSONresponse(res, 404, {
            "message": "locationid not found"
          });
          return;
        } else if (err) {
          sendJSONresponse(res, 400, err);
          return;
        }
        if (location.reviews && location.reviews.length > 0) {
          thisReview = location.reviews.id(req.params.reviewid);
          if (!thisReview) {
            sendJSONresponse(res, 404, {
              "message": "reviewid not found"
            });
          } else {
            thisReview.author = req.body.author;
            thisReview.rating = req.body.rating;
            thisReview.reviewText = req.body.reviewText;
            location.save(function(err, location) {
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                updateAverageRating(location._id);
                sendJSONresponse(res, 200, thisReview);
              }
            });
          }
        } else {
          sendJSONresponse(res, 404, {
            "message": "No review to update"
          });
        }
      }
  );
};


module.exports.reviewsDeleteOne = function(req, res) {
  if (!req.params.locationid || !req.params.reviewid) {
    sendJSONresponse(res, 404, {
      "message": "Not found, locationid and reviewid are both required"
    });
    return;
  }
  Loc
    .findById(req.params.locationid)
    .select('reviews')
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
        if (location.reviews && location.reviews.length > 0) {
          if (!location.reviews.id(req.params.reviewid)) {
            sendJSONresponse(res, 404, {
              "message": "reviewid not found"
            });
          } else {
            location.reviews.id(req.params.reviewid).remove();//elimina el review
            location.save(function(err) {//salva el nuevo docuemnto despues de haber eliminado el review
              if (err) {
                sendJSONresponse(res, 404, err);
              } else {
                updateAverageRating(location._id);//calcula el nuevo rating
                sendJSONresponse(res, 204, null);
              }
            });
          }
        } else {
          sendJSONresponse(res, 404, {
            "message": "No review to delete"
          });
        }
      }
  );
};
