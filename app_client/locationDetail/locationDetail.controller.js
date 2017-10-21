(function () {
	angular
		.module('loc8rApp')
		.controller('locationDetailCtrl', locationDetailCtrl);
	locationDetailCtrl.$inject = ['authentication','$routeParams','loc8rData', '$uibModal','oldPath'];
	function locationDetailCtrl (authentication,$routeParams, loc8rData, $uibModal,oldPath) {//($routeParams)) {
		var vm = this;
		vm.locationid=$routeParams.locationid;
		vm.isLoggedIn = authentication.isLoggedIn();
		oldPath.setPath();

		loc8rData.locationById(vm.locationid ).then(
			function(response){//success
				vm.data = { location: response.data };
				vm.pageHeader = {
					title: vm.data.location.name
				};

				
			},
			function(response){//error
				console.log(e);
			});
		vm.popupReviewForm = function () {
			var modalInstance = $uibModal.open({
				templateUrl: '/reviewModal/reviewModal.view.html',
				controller: 'reviewModalCtrl as vm',
				resolve : {
					locationData : function () {
						return {
							locationid : vm.locationid,
							locationName : vm.data.location.name
						};
					}	
				}
			});

			modalInstance.result.then(function (data) {
				vm.data.location.reviews.push(data);

			});
		};
	}
})();