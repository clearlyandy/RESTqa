'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', '$anchorScroll', '$location', function ($scope, Global, $anchorScroll, $location) {
    $scope.global = Global;

    $scope.scrollTo = function(id) {
    	$location.hash(id);
		$anchorScroll();
		window.scrollTo(document.documentElement.scrollTop - 50, 0);
	};
}]);