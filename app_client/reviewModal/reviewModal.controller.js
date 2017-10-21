(function () {
	angular
	 .module('loc8rApp')
	 .controller('reviewModalCtrl', reviewModalCtrl);

	
	reviewModalCtrl.$inject = ['$uibModalInstance', 'loc8rData','locationData'];
	function reviewModalCtrl ($uibModalInstance, loc8rData, locationData) {
		var vm = this;
		vm.locationData=locationData;
		vm.modal = {
			cancel : function () {
				$uibModalInstance.dismiss('cancel');
			},
			close : function (result) {
				$uibModalInstance.close(result);
			}
		};

		 
		

		vm.doAddReview = function (locationid, formData) {
			loc8rData.addReviewById(locationid, {
				rating : formData.rating,
				reviewText : formData.reviewText
			})
			.then(
				function (response) {//successCallback
					vm.modal.close(response.data);

				},
				function (response) {//errorCallback
					vm.formError = "Your review has not been saved, try again";
				}
			)
			
				return false;
		};

		vm.onSubmit = function () {
			vm.formError = "";
			console.log(vm.formData);
			if( !vm.formData.rating || !vm.formData.reviewText) {
				vm.formError = "All fields required, please try again";
				return false;
			} else {
				console.log(vm.formData);
				vm.doAddReview(vm.locationData.locationid, vm.formData);
			}

		};
			

	}
})();