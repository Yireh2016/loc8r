var express = require('express');
var router = express.Router();
//var ctrlMain = require('../controllers/main');
var crtlLocations = require('../controllers/locations');
var crtlOthers = require('../controllers/others');



/*var homepageController = function(req, res, next) {
  res.render('index', { title: 'Express' });
};*/
/* GET home page. */


/* Locations pages */

router.get('/', crtlLocations.homeList);
router.get('/location', crtlLocations.locationInfo);
//router.get('/location/review/new', crtlLocations.addReview2);
router.get('/addReview', crtlLocations.addReview);


/* Other pages */

router.get('/about', crtlOthers.about);


module.exports = router;
