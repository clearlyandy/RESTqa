'use strict';

angular.module('mean.web-services').config(['$stateProvider',
    function($stateProvider) {
        var checkLoggedin = function($q, $timeout, $http, $location) {
            // Initialize a new promise
            var deferred = $q.defer();

            // Make an AJAX call to check if the user is logged in
            $http.get('/loggedin').success(function(user) {
                // Authenticated
                if (user !== '0') $timeout(deferred.resolve);

                // Not Authenticated
                else {
                    $timeout(deferred.reject);
                    $location.url('/login');
                }
            });

            return deferred.promise;
        };

        $stateProvider
            .state('web services', {
                url: '/web-services',
                templateUrl: 'web-services/views/list.html'
            })
            .state('create web service', {
                url: '/web-services/create',
                templateUrl: 'web-services/views/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit webservice', {
                url: '/web-services/:webserviceId/edit',
                templateUrl: 'web-services/views/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('webservice by id', {
                url: '/web-services/:webserviceId',
                templateUrl: 'web-services/views/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });
    }
]);