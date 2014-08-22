'use strict';

angular.module('mean.web-services').controller('ContactController', ['$scope', '$http', '$stateParams', '$location', 'Global',

    function($scope, $http, $stateParams, $location, Global) {
        $scope.global = Global;
        $scope.sending = false;
        $scope.senderror = false;
        $scope.sent = false;
        $scope.package = {
            name: 'contact'
        };

        $scope.sendMessage = function() {
            $scope.senderror = false;
            $scope.sending = true;
            $http.post('/contact', {
                name: $scope.name,
                email: $scope.email,
                subject: $scope.subject,
                text: $scope.text
            })
            .success(function(response) {
                $scope.response = response;
                $scope.sent = true;
                $scope.sending = false;
            })
            .error(function(error) {
                $scope.response = error;
                $scope.sending = false;
                $scope.senderror = true;
            });
        };
    }
]);