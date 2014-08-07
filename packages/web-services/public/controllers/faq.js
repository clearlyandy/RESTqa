'use strict';

angular.module('mean.web-services').controller('FAQController', ['$scope', '$http', '$stateParams', '$location', 'Global',

    function($scope, $http, $stateParams, $location, Global) {
        $scope.global = Global;
        $scope.package = {
            name: 'faq'
        };
        $scope.faqlist = [
            {
                title: 'title',
                text: 'text',
                active: false
            },
            {
                title: 'title',
                text: 'text',
                active: false
            }
        ];

        $scope.accordionToggle = function(item) {
            for (var itemIdx = 0; itemIdx < $scope.faqlist.length; itemIdx++) {
                if (item !== $scope.faqlist[itemIdx]) {
                    if ($scope.faqlist[itemIdx].active === true) {
                        $scope.faqlist[itemIdx].active = false;
                    }
                }
            }

            item.active = (item.active) ? false : true;
        };
    }
]);