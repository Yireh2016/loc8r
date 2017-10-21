(function () {
	angular
	 .module('loc8rApp')
	 .directive('navigation', navigation);
	
	function navigation () {
		return {
			restrict: 'EA',
			templateUrl: '/common/directives/navigation/navigation.template.html',
			controller: 'navigationCtrl as navvm'//le cambiamos el nombre para referirnos al controlador diferente a VM que se usa para los otros controladores de las paginas
		};
	}
})();