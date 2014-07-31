'use strict';

angular.module('mean.web-services').factory('Requests', ['$resource',
    function($resource) {
        var factory = {};

        factory.manager = $resource('requests/:requestId', {
            requestId: '@_id'
        }, {
            update: {
                method: 'PUT'
            },
            getAll: {
                method: 'GET',
                isArray: true
            }
        });

        factory.tester = $resource('requests/:requestId/test', {
            requestId: '@_id'
        }, {});

        return factory;
    }
]);