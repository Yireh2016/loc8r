(function(){
	angular
	.module('loc8rApp')
	.controller('homeCtrl', homeCtrl);

	homeCtrl.$inject=['$scope', 'loc8rData', 'geolocation','oldPath'];
	function homeCtrl($scope, loc8rData, geolocation,oldPath){
		var vm = this;
		vm.pageHeader = {
			title: 'Loc8r',
			strapline: 'Find places to work with wifi near you!'
		};
		vm.sidebar = {
			content: "Looking for wifi and a seat? Loc8r helps you find places to work when out and about. Perhaps with coffee, cake or a pint? Let Loc8r help you find the place you're looking for.",		
		};

		oldPath.setPath();//se registra el path de home en caso de ser necesario por el controlador de log in o sing in para regresar a la pantalla anterior


		vm.message = "Checking your location";


		vm.getData = function(position){//position viene del mertodo navigator.geolocation
			vm.message = "Searching for nearby places";
			var lat=51.9//position.coords.latitude,
				lng=-.9151//position.coords.longitude;
				

			loc8rData.locationByCoords(lat, lng ).then(
				function(response){//success
					vm.message = response.data.length > 0 ? "" : "No locations found";
					vm.data =  {locations : response.data};
					console.log(vm.data.locations);
					
				},
				function(response){//error
					vm.message = "Sorry, something's gone wrong ";
				});
		};

		vm.showError = function (error) {
			$scope.$apply(function() {//se realiza expresamente el apply para que se ejecute la funcion interna
				vm.message = error.message;
			});
		};
		
		vm.noGeo = function () {
			$scope.$apply(function() {
				vm.message = "Geolocation not supported by this browser.";
			});
		};	

		geolocation.getPosition(vm.getData,vm.showError,vm.noGeo);
	};





})();