(function () {
	angular
	.module('loc8rApp')
	.service('oldPath', oldPath);

	oldPath.$inject = ['$location'];

	function oldPath($location){

		var path = '/'; //default path

		var getPath = function(){//getter method to get the old path
			return path;

		};

		var setPath = function(){//setter method to set the actual path
			 path = $location.path();

		};

		return {
			setPath:setPath,
			getPath:getPath
		}
	};

})();
