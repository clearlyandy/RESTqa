'use strict';

angular.module('mean.system').controller('IndexController', ['$scope', 'Global', '$anchorScroll', '$location', function ($scope, Global, $anchorScroll, $location) {
    $scope.global = Global;

    $scope.scrollTo = function(id) {
    	console.log("HI");
    	$location.hash(id);
		$anchorScroll();
		console.log(document.documentElement.scrollTop)
		window.scrollTo(document.documentElement.scrollTop - 50, 0);
	};
}]);