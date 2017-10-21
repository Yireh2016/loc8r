(function () {
	angular
	.module('loc8rApp')
	.service('authentication', authentication);
	authentication.$inject = ['$window','$http'];
	function authentication ($window, $http) {

		var saveToken = function (token) {
			console.log("se procedera a guardar el token "+token + " en el local storage")
			$window.localStorage['loc8r-token'] = token;
		};
	
		var getToken = function () {
			return $window.localStorage['loc8r-token'];
		};

		

		var register = function(user) {
			return $http.post('/api/register', user);
		};


		var login = function(user) {
				return $http.post('/api/login', user);
			};

		var logout = function() {//elimina el token del local storage
			$window.localStorage.removeItem('loc8r-token');
		};

		var isLoggedIn = function() {//devuelve erdadero si el token existe y esta vigente
			var token = getToken();
			if(token){
				var payload = JSON.parse($window.atob(token.split('.')[1]));//decodifica token tomando la parte del payload 
				return payload.exp > Date.now() / 1000;
			} else {
				return false;
			}
		};


		var currentUser = function() {
			if(isLoggedIn()){//verifica si la sesion del usuario esta activa 
				var token = getToken();//si esta activa obtiene el token del local storage
				var payload = JSON.parse($window.atob(token.split('.')[1]));//obtiene el payload para luego extraer el email y el nombre del usuario
				return {
					email : payload.email,
					name : payload.name
				};
			}
		};

		return {
			saveToken : saveToken,
			getToken : getToken,
			register : register,
			login : login,
			logout : logout,
			isLoggedIn:isLoggedIn,
			currentUser:currentUser
		};
		
	}
})();