'use strict';

angular.module('mean.system').controller('FooterController', ['$scope', 'Global', '$location', '$route', '$rootScope', function ($scope, Global, $location, $route, $rootScope) {
    $scope.global = Global;

    $rootScope.$on('$locationChangeStart', function(event, newUrl, oldUrl){
	   $scope.showFooter = $location.path() === '/';
	 });
}]);