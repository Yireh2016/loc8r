(function() {
	angular.module('loc8rApp', ['ngRoute', 'ngSanitize','ui.bootstrap']);//se cambio ng-route por ngRoute y enpezó a funcionar

	function config ($routeProvider, $locationProvider){//funcion de configuraciom del enrutador
		console.log('entro al enrutador ');
		$routeProvider
			.when('/', {
				templateUrl: 'home/home.view.html',
				
				controller: 'homeCtrl',
				controllerAs: 'vm'

			})
			.when('/about', {
				templateUrl: 'common/views/genericText.view.html',
				
				controller: 'aboutCtrl',
				controllerAs: 'vm'

			})
			.when('/location/:locationid', {//location/:locationid
				
				templateUrl: '/locationDetail/locationDetail.view.html',
				controller: 'locationDetailCtrl',
				controllerAs: 'vm'
			})
			.when('/register', {
				templateUrl: '/auth/register/register.view.html',
				controller: 'registerCtrl',
				controllerAs: 'vm'
			})
			.when('/login', {
				templateUrl: '/auth/login/login.view.html',
				controller: 'loginCtrl',
				controllerAs: 'vm'
			})
			.otherwise({redirectTo: '/'});

			$locationProvider.html5Mode({
			    enabled: true,
			    requireBase: false
			});
	}


	angular
		.module('loc8rApp')
		.config(['$routeProvider', '$locationProvider' ,config]);//enrutador
	})();// esto es un immediately invoked function expression (IIFE). ayuda a tener un unico SCOPE o ambito separado del global