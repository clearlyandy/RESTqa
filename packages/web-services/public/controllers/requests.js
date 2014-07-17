'use strict';

angular.module('mean.web-services').controller('RequestsController', ['$scope', '$http', '$stateParams', '$location', 'Global', 'Requests',

    function($scope, $http, $stateParams, $location, Global, Requests) {
        $scope.global = Global;
        $scope.package = {
            name: 'requests'
        };

        $scope.hasAuthorization = function(request) {
            if (!request || !request.user) return false;
            return $scope.global.isAdmin || request.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var request = new Requests({
                    name: this.name,
                    description: this.description,
                    request_type: this.request_type,
                    payload: this.payload,
                    expected_output: this.expected_output,
                    web_service: $stateParams.webserviceId
                });

                request.$save(function(response) {
                    $location.path('web-services/' + response.web_service + '/requests/' + response._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(request) {
            if (request) {
                request.$remove(function(response) {
                    $location.path('web-services/' + response.web_service);
                });
            } else {
                $scope.request.$remove(function(response) {
                    $location.path('web-services/' + response.web_service);
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var request = $scope.request;
                if (!request.updated) {
                    request.updated = [];
                }
                request.updated.push(new Date().getTime());

                request.$update(function(response) {
                    $location.path('web-services/' + response.web_service + '/requests/' + response._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.testRequest = function(request) {
            var responsePromise = null;

            responsePromise = $http.get($scope.$parent.webservice.endpoint + '/?' + request.payload);

            responsePromise.success(function(data, status, headers, config) {
                console.log(data);
            });
            responsePromise.error(function(data, status, headers, config) {
                alert('AJAX failed!');
            });
        };

        $scope.find = function() {
            Requests.query(function(requests) {
                $scope.requests = requests;
            });
        };

        $scope.findOne = function() {
            Requests.get({
                requestId: $stateParams.requestId
            }, function(request) {
                $scope.request = request;
            });
        };
    }
]);