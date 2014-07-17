'use strict';

angular.module('mean.web-services').controller('WebServicesController', ['$scope', '$stateParams', '$location', 'Global', 'WebServices',

    function($scope, $stateParams, $location, Global, WebServices) {
        $scope.global = Global;
        $scope.package = {
            name: 'web-services'
        };

        $scope.hasAuthorization = function(webservice) {
            if (!webservice || !webservice.user) return false;
            return $scope.global.isAdmin || webservice.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var webservice = new WebServices({
                    name: this.name,
                    description: this.description,
                    endpoint: this.endpoint
                });
                webservice.$save(function(response) {
                    $location.path('web-services/' + response._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(webservice) {
            if (webservice) {
                webservice.$remove(function(response) {
                    $location.path('web-services');
                });
            } else {
                $scope.webservice.$remove(function(response) {
                    $location.path('web-services');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var webservice = $scope.webservice;
                if (!webservice.updated) {
                    webservice.updated = [];
                }
                webservice.updated.push(new Date().getTime());

                webservice.$update(function() {
                    $location.path('web-services/' + webservice._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.find = function() {
            WebServices.query(function(webservices) {
                $scope.webservices = webservices;
            });
        };

        $scope.findOne = function() {
            WebServices.get({
                webserviceId: $stateParams.webserviceId
            }, function(webservice) {
                $scope.webservice = webservice;
            });
        };
    }
]);