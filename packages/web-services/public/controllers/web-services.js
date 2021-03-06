'use strict';

angular.module('mean.web-services').controller('WebServicesController', ['$scope', '$stateParams', '$location', 'Global', 'WebServices', 'Requests',

    function($scope, $stateParams, $location, Global, WebServices, Requests) {
        $scope.global = Global;
        $scope.package = {
            name: 'web-services'
        };
        $scope.selectedItem = {};
        $scope.options = {};
        $scope.parameters = [];

        $scope.hasAuthorization = function(webservice) {
            if (!webservice || !webservice.user) return false;
            return $scope.global.isAdmin || webservice.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid && !$scope.hasEmptyObjectParameter(this.parameters)) {
                var webservice = new WebServices({
                    name: this.name,
                    description: this.description,
                    request_type: this.request_type,
                    endpoint: this.endpoint,
                    parameters: this.parameters
                });
                webservice.$save(function(response) {
                    $location.path('web-services');
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(webservice) {
            if (webservice) {
                webservice.$remove(function(response) {
                    if ($scope.webservices) {
                        $scope.webservices.splice($scope.webservices.indexOf(webservice), 1);
                    }
                    $location.path('web-services');
                });
            } else {
                $scope.webservice.$remove(function(response) {
                    $location.path('web-services');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid && !$scope.hasEmptyObjectParameter($scope.parameters)) {
                var webservice = $scope.webservice;
                if (!webservice.updated) {
                    webservice.updated = [];
                }
                webservice.updated.push(new Date().getTime());

                webservice.$update(function() {
                    $location.path('web-services');
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
                $scope.parameters = webservice.parameters;
            });
        };

        $scope.findRequests = function() {
            Requests.query({
                webserviceId: $stateParams.webserviceId
            }, function(requests) {
                $scope.requests = requests;
            });
        };

        $scope.removeSubItem = function(scope) {
            scope.remove();
        };

        $scope.toggle = function(scope) {
            scope.toggle();
        };

        $scope.newSubItem = function(scope) {
            var nodeData;
            if (scope === null) {
                $scope.parameters.push({
                    parameters: []
                });
            } else {
                nodeData = scope.$modelValue;
                nodeData.parameters.push({
                    parameters: []
                });
            }
        };

        $scope.hasEmptyObjectParameter = function(paramObj) {
            for (var param in paramObj) {
                var thisParam = paramObj[param];
                if (thisParam.data_type === 'Object') {
                    if (thisParam.parameters.length < 1) {
                        return true;
                    } else {
                        $scope.hasEmptyObjectParameter(thisParam.parameters);
                    }
                }
            }

            return false;
        };
    }
]);