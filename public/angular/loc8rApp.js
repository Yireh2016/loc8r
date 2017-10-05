angular.module('loc8rApp', []);


var loc8rData = function ($http) {
	var locationByCoords = function(lat, lng){
		return $http.get('/api/locations?lng=' + lng + '&lat=' + lat + '&maxDistance=999999');
	};

	return {
		locationByCoords:locationByCoords
	}
}

var locationListCtrl = function ($scope, loc8rData, geoLocation) {
	$scope.message = "Checking your location";


	$scope.getData = function(position){//position viene del mertodo navigator.geolocation
		$scope.message = "Searching for nearby places";
		var lat=50.9//position.coords.latitude,
			lng=-.9151//position.coords.longitude;
			console.log(lat,lng);

		loc8rData.locationByCoords(lat, lng ).then(
			function(response){//success
				$scope.message = response.data.length > 0 ? "" : "No locations found";
				$scope.data =  {locations : response.data};
				
			},
			function(response){//error
				$scope.message = "Sorry, something's gone wrong ";
			});
	};

	$scope.showError = function (error) {
		$scope.$apply(function() {//se realiza expresamente el apply para que se ejecute la funcion inerna
			$scope.message = error.message;
		});
	};
	
	$scope.noGeo = function () {
		$scope.$apply(function() {
			$scope.message = "Geolocation not supported by this browser.";
		});
	};	

	geoLocation.getPosition($scope.getData,$scope.showError,$scope.noGeo);
};



var geoLocation = function(){
	var getPosition = function(cbSuccess,cbError,cbNoGeo){
		if(navigator.geolocation){
			navigator.geolocation.getCurrentPosition(cbSuccess,cbError);
		}else{
			cbNoGeo();
		}
	};
	return {
		getPosition : getPosition
	};
};


var _isNumeric = function (n) {
	return !isNaN(parseFloat(n)) && isFinite(n);
};

var formatDistance = function () {
	return function (distance) {
		var numDistance, unit;
		if (distance && _isNumeric(distance)) {
			if (distance > 1000) {
				numDistance = parseFloat(distance).toFixed(1);
				unit = ' km';
			} else {
				numDistance = parseInt(distance,10);
				unit = ' m';
			}
			return numDistance + unit;
		} else {
			return "?";
		}
	};
};

var ratingStars = function(){//debe estar defino en camelCase formato minuscMayuscu para que al pasar a HTML se transforme en camel-case ya que HTML no es case sensitive
	return {

		scope:{
			thisRating: '=rating'
		},
		templateUrl: '/angular/rating-stars.html'//template: "{{ thisRating }}"
	};

};




angular
.module('loc8rApp')
.controller('locationListCtrl', locationListCtrl)
.filter('formatDistance', formatDistance)//filtro personalizado
.directive('ratingStars', ratingStars)//directiva (para agregar fragmentos HTML) con un scope isolated (alcance aislada e independinete de la alcance padre)
.service('loc8rData', loc8rData)//unidad de codigo auto contenida que puede ser combinada para proveer funcionalidades a una aplicacion
.service('geoLocation', geoLocation);
