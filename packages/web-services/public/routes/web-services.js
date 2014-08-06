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
                templateUrl: 'web-services/views/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
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
            })
            .state('view web service request', {
                url: '/web-services/:webserviceId/requests',
                templateUrl: 'web-services/views/requests/list.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('create web service request', {
                url: '/web-services/:webserviceId/requests/create',
                templateUrl: 'web-services/views/requests/create.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('request by id', {
                url: '/web-services/:webserviceId/requests/:requestId',
                templateUrl: 'web-services/views/requests/view.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            })
            .state('edit request', {
                url: '/web-services/:webserviceId/requests/:requestId/edit',
                templateUrl: 'web-services/views/requests/edit.html',
                resolve: {
                    loggedin: checkLoggedin
                }
            });

    }
]).run(['$rootScope','$location', 'Global', function($rootScope, $location, Global) {
    $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        var fullRoute = toState;
        if (!!Global.user._id) {
            if (toState.url === '/') {
                $location.path('/web-services');
            }
        }

        console.log(fullRoute);
    });
}]);