'use strict';

angular.module('mean.web-services').factory('WebServices', ['$resource',
    function($resource) {
        return $resource('web-services/:webserviceId', {
            webserviceId: '@_id'
        }, {
            update: {
                method: 'PUT'
            }
        });
    }
]);