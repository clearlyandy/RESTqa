'use strict';

angular.module('mean.web-services').factory('Requests', ['$resource',
    function($resource) {
        return $resource('requests/:requestId', {
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
    }
]);