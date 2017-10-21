(function(){
	angular
	.module('loc8rApp')
	.directive('ratingStars', ratingStars);

	function ratingStars () {//debe estar defindo en camelCase formato minuscMayuscu para que al pasar a HTML se transforme en camel-case ya que HTML no es case sensitive
		return {

			scope:{
				thisRating: '=rating'
			},
			restrict: 'EA',//This tells Angular to only use the ratingStars directive when the string rating-stars is found
						   //in particular places. In this instance the E and the A stand for element and attribute
			templateUrl: '/common/directives/ratingStars/ratingStars.template.html'//template: "{{ thisRating }}"
		};

	};

})();