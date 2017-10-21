(function () {
	angular
	.module('loc8rApp')
	.controller('loginCtrl', loginCtrl);
	loginCtrl.$inject = ['$location','authentication','oldPath'];
	function loginCtrl($location, authentication,oldPath) {
		var vm = this;
		vm.pageHeader = {
			title: 'Login in to Loc8r'
		};
		vm.credentials = {
			email : "",
			password : ""
		};
		vm.returnPage = $location.search().page || '/';
		vm.onSubmit = function () {
			vm.formError = "";
			if (!vm.credentials.email || !vm.credentials.password) {
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				vm.doLogin();
			}
		};
		vm.doLogin = function() {
			vm.formError = "";


			authentication
			.login({
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