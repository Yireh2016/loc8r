(function () {
	angular
	.module('loc8rApp')
	.controller('registerCtrl', registerCtrl);
	registerCtrl.$inject = ['$location','authentication','oldPath'];
	function registerCtrl($location, authentication,oldPath) {
		var vm = this;
		vm.pageHeader = {
			title: 'Create a new Loc8r account'
		};
		vm.credentials = {
			name : "",
			email : "",
			password : ""
		};

			
		console.log('pagina '+ oldPath.getPath());

		//$location.search('page', 'about');//se setea el query string en la pagina anterior
		//vm.returnPage = $location.search().page || '/';
		//console.log('la pagina de retorno es '+ JSON.stringify(vm.returnPage)	);
		vm.onSubmit = function () {
			vm.formError = "";
			if (!vm.credentials.name || !vm.credentials.email || !vm.credentials.password) {//valida que existan todos los valores del formulario
				vm.formError = "All fields required, please try again";
				return false;
			} else {

				vm.doRegister();
			}
		};


		vm.doRegister = function() {
			vm.formError = "";


			authentication
			.register({
				name: vm.credentials.name,
				email: vm.credentials.email,
				password: vm.credentials.password
			}).then(
				function(response){
					console.log("el token es  " +response.data.token);
					authentication.saveToken(response.data.token);
					//$location.search('page', null);//clear the query string object
					//$location.path(vm.returnPage);//set the application path to be the returnPage we captured earlier.
											  //This will redirect the user to that path.
					$location.url(oldPath.getPath());

				}
				,
				function(response){
					vm.formError = response.data.errmsg;
				});

		
		};

	}
})();