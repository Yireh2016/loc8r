(function () {
	angular
	.module('loc8rApp')
	.controller('navigationCtrl', navigationCtrl);

	navigationCtrl.$inject = ['$route','$location','authentication'];

	function navigationCtrl($route,$location, authentication) {
		var vm = this;
		//vm.currentPath = $location.path();
		vm.isLoggedIn = authentication.isLoggedIn();
		vm.currentUser = authentication.currentUser();
		console.log('el usuario logeado es ' + JSON.stringify(vm.currentUser ));
		vm.logout = function() {
			authentication.logout();
			console.log('el usuario esta deslogueado ' + $location.url() );
			if($location.url() === '/'){
				$route.reload();
			}else{
				$location.path('/');
				}// puede ir a una pagina de confirmacion
		};


	}
})();