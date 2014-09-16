'use strict';

angular.module('mean.web-services').controller('RequestsController', ['$scope', '$http', '$stateParams', '$location', 'Global', 'Requests', 'WebServices',

    function($scope, $http, $stateParams, $location, Global, Requests, WebServices) {
        $scope.global = Global;
        $scope.package = {
            name: 'requests'
        };
        $scope.parameters = {};
        $scope.jsonData = {};
        $scope.response = {};
        $scope.response.headers = {};
        $scope.response.body = {};
        $scope.hasResponse = false;
        $scope.assertions = [];
        $scope.assertions3 = {};
        $scope.assertions3.body = {};

        $scope.hasAuthorization = function(request) {
            if (!request || !request.user) return false;
            return $scope.global.isAdmin || request.user._id === $scope.global.user._id;
        };

        $scope.create = function(isValid) {
            if (isValid) {
                var request = new Requests.manager({
                    name: this.name,
                    description: this.description,
                    parameters: angular.copy($scope.webservice.parameters),
                    expected_output: this.expected_output,
                    web_service: $stateParams.webserviceId
                });
                request.$save(function(response) {
                    $location.path('web-services/' + response.web_service + '/requests');
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.remove = function(request) {
            if (request) {
                request.$remove(function(response) {
                    if ($scope.requests) {
                        $scope.requests.splice($scope.requests.indexOf(request), 1);
                    }
                    $location.path('web-services/' + response.web_service + '/requests');
                });
            } else {
                $scope.request.$remove(function(response) {
                    $location.path('web-services/' + response.web_service + '/requests');
                });
            }
        };

        $scope.update = function(isValid) {
            if (isValid) {
                var request = $scope.request;
                if (!request.updated) {
                    request.updated = [];
                }

                request.web_service = request.web_service._id;
                request.parameters = $scope.parameters;

                request.updated.push(new Date().getTime());

                request.$update(function(response) {
                    $location.path('web-services/' + response.web_service + '/requests/' + response._id);
                });
            } else {
                $scope.submitted = true;
            }
        };

        $scope.testRequest = function(request) {
            $scope.updateAssertions();
            $scope.hasResponse = false;
            Requests.tester.get({
                requestId: request._id
            }, function(response) {
                $scope.response = response;
                $scope.response.body = JSON.parse(response.body);
                $scope.assertions3 = {};
                var xxx = {
                    "PSInfo": {
                        "EGDQ": {
                            "customQs": 234
                        }
                    }
                };
                $scope.assertions3.body = $scope.extendDeep(angular.copy($scope.response.body), xxx);
                console.log($scope.assertions3);
                $scope.hasResponse = true;

            });
        };

        $scope.find = function() {
            WebServices.get({
                webserviceId: $stateParams.webserviceId
            }, function(webservice) {
                $scope.webservice = webservice;
                Requests.manager.getAll({
                    webserviceId: $stateParams.webserviceId
                }, function(requests) {
                    $scope.requests = requests;
                });
            });
        };

        $scope.findOne = function() {
            Requests.manager.get({
                requestId: $stateParams.requestId
            }, function(request) {
                $scope.request = request;
                $scope.parameters = request.parameters;
                $scope.testRequest(request);
            });
        };

        $scope.extendDeep = function extendDeep(dst) {
            angular.forEach(arguments, function(obj) {
            if (obj !== dst) {
              angular.forEach(obj, function(value, key) {
                if (dst[key] && dst[key].constructor && dst[key].constructor === Object) {
                  extendDeep(dst[key], value);
                } else {
                  dst[key] = value;
                }
              });
            }
            });
            return dst;
        };

        $scope.updateAssertions = function() {
            var assertions = [];
            for (var item in $scope.assertions) {
                var assertion = $scope.assertions[item];
                var value = assertion.scope.child[assertion.key];
                var path = assertion.key;
                var s = assertion.scope.parent;
                while (typeof s !== 'undefined') {
                    path = s.key + '.' + path;
                    s = s.parent;
                }
                assertions.push({'key': path, 'value': value});
            }

            console.log(assertions);
        };
    }
])
// directive to focus an input element
// usage: <input type="text" focus />
/*.directive('focus', function() {
    return {
        restrict: 'A',
        link: function(scope, element, attributes) {
            element[0].focus();
        }
    };
})*/
.directive('json', function($compile, $timeout) {
    return {
        restrict: 'E',
        scope: {
            root: '=',
            parent: '=',
            child: '=',
            type: '=',
            editable: '=',
            assertionchild: "=",
            assertions:'=bindingAssertions'
        },

        link: function(scope, element, attributes) {
            var stringName = 'Text';
            var objectName = 'Catalog'; // or technically more correct: Map
            var arrayName = 'List';
            var refName = 'Reference';

            scope.hasChildAssertionFailed = false;
            scope.failedAssertions = [];
            scope.valueTypes = [stringName, objectName, arrayName, refName];

            //////
            // Helper functions
            //////
            var getType = function(obj) {
                var type = Object.prototype.toString.call(obj);
                if (type === '[object Object]') {
                    return 'Object';
                } else if (type === '[object Array]') {
                    return 'Array';
                } else {
                    return 'Literal';
                }
            };
            var isNumber = function(n) {
                return !isNaN(parseFloat(n)) && isFinite(n);
            };
            scope.getType = function(obj) {
                return getType(obj);
            };

            scope.toggleCollapse = function() {
                if (scope.collapsed) {
                    scope.collapsed = false;
                    scope.chevron = 'glyphicon glyphicon-chevron-down';
                } else {
                    scope.collapsed = true;
                    scope.chevron = 'glyphicon glyphicon-chevron-right';
                }
            };
            scope.initToggle = function() {
                scope.chevron = 'glyphicon glyphicon-chevron-down';
                if (scope.root === true) {
                    scope.collapsed = false;
                } else {
                    scope.chevron = 'glyphicon glyphicon-chevron-right';
                    scope.collapsed = true;
                }
            };
            scope.moveKey = function(obj, key, newkey) {
                //moves key to newkey in obj
                obj[newkey] = obj[key];
                delete obj[key];
            };

            scope.sss = false;
            scope.assertions2 = [];
            scope.checkAssertion = function(obj, key) {
                console.log(key);
                console.log(JSON.stringify(scope.child[key]) == JSON.stringify(scope.assertionchild[key]));
                var xxx = {
                    "PSInfo": {
                        "EGDQ": {
                            "customQs": 234
                        }
                    }
                };



                return false;

                console.log(scope.child);
                var path = key;
                var s = scope.parent;
                while (typeof s !== 'undefined') {
                    path = s.key + '.' + path;
                    s = s.parent;
                }
                if (scope.sss === false) {
                    scope.assertions2.push({key: 'PSInfo.EGDQ.customQs', value: 234});
                    scope.sss = true;
                }

                for (var item in scope.assertions2) {
                    var assertion = scope.assertions2[item];
                    if (assertion.key === path) {
                        var assertionKey = scope.flagKey(obj, key);

                        if (assertion.value !== obj[key]) {
                            scope.failedAssertions[key] = assertion.value;
                            scope.collapsed = false;
                            s = scope.$parent;
                            while (typeof s.parent !== 'undefined') {
                                s.parent.hasChildAssertionFailed = true;
                                s.parent.flagged = true;
                                s.parent.collapsed = false;
                                s = s.parent;
                            }

                            return true;
                        }
                        break;
                    }
                }
                return false;
            };

            scope.hasAssertionFailed = function(key) {
                if (key in scope.failedAssertions) {
                    return true;
                }
                return false;
            }

            scope.flagKey = function(obj, key) {
                console.log(scope.parent);
                var assertionKey = scope.$id + key;

                if (typeof scope.assertions[assertionKey] === 'undefined') {
                    scope.isFlagged = true;
                    scope.assertions[assertionKey] = {'scope': scope,  'key': key, 'value': obj[key]};
                } else {
                    scope.isFlagged = false;
                    delete scope.assertions[assertionKey];
                }

                return assertionKey;
            };
            scope.deleteKey = function(obj, key) {
                if (getType(obj) === 'Object') {
                    if (confirm('Delete ' + key + ' and all it contains?')) {
                        var assertionKey = scope.$id + key;
                        if (typeof scope.assertions[assertionKey] !== 'undefined') {
                            delete scope.assertions[assertionKey];
                        }
                        delete obj[key];
                    }
                } else if (getType(obj) === 'Array') {
                    if (confirm('Delete "' + obj[key] + '"?')) {
                        obj.splice(key, 1);
                    }
                } else {
                    console.error('object to delete from was ' + obj);
                }
            };
            scope.addItem = function(obj) {
                if (getType(obj) === 'Object') {
                    // check input for key
                    if (scope.keyName === undefined || scope.keyName.length === 0) {
                        alert('Please fill in a name');
                    } else if (scope.keyName.indexOf('$') === 0) {
                        alert('The name may not start with $ (the dollar sign)');
                    } else if (scope.keyName.indexOf('_') === 0) {
                        alert('The name may not start with _ (the underscore)');
                    } else {
                        if (obj[scope.keyName]) {
                            if (!confirm('An item with the name "' + scope.keyName + '" exists already. Do you really want to replace it?')) {
                                return;
                            }
                        }
                        // add item to object
                        switch (scope.valueType) {
                            case stringName:
                                obj[scope.keyName] = scope.valueName ? scope.possibleNumber(scope.valueName) : '';
                                break;
                            case objectName:
                                obj[scope.keyName] = {};
                                break;
                            case arrayName:
                                obj[scope.keyName] = [];
                                break;
                            case refName:
                                obj[scope.keyName] = {
                                    'Reference!!!!': 'todo'
                                };
                                break;
                        }
                        //clean-up
                        scope.keyName = '';
                        scope.valueName = '';
                        scope.showAddKey = false;
                    }
                } else if (getType(obj) === 'Array') {
                    // add item to array
                    switch (scope.valueType) {
                        case stringName:
                            obj.push(scope.valueName ? scope.valueName : '');
                            break;
                        case objectName:
                            obj.push({});
                            break;
                        case arrayName:
                            obj.push([]);
                            break;
                        case refName:
                            obj.push({
                                'Reference!!!!': 'todo'
                            });
                            break;
                    }
                    scope.valueName = '';
                    scope.showAddKey = false;
                } else {
                    console.error('object to add to was ' + obj);
                }
            };
            scope.possibleNumber = function(val) {
                return isNumber(val) ? parseFloat(val) : val;
            };

            //////
            // Template Generation
            //////

            // Note:
            // sometimes having a different ng-model and then saving it on ng-change
            // into the object or array is necesarry for all updates to work

            // recursion
            var switchTemplate =
                '<span ng-switch on="getType(val)" >' + '<json ng-switch-when="Object" root="false" child="val" parent="$parent" assertionchild="assertionchild[key]" ng-model="newkey" type="\'object\'" binding-assertions="assertions" editable="' + scope.editable + '" ></json>' + '<json ng-switch-when="Array" root="false" child="val" type="\'array\'" assertionchild="assertionchild[key]" binding-assertions="assertions" editable="' + scope.editable + '"></json>' + '<span ng-switch-default class="jsonLiteral"><input type="text" ng-model="val" ng-disabled="editable==false" placeholder="Empty" ng-model-onblur ng-change="child[key] = possibleNumber(val)"/>' + '</span>' + '</span>';

            // display either "plus button" or "key-value inputs"
            var addItemTemplate =
                '<div ng-switch ng-if="editable==true" on="showAddKey" class="block">' + '<span ng-switch-when="true">';
            if (scope.type === 'object') {
                // input key
                addItemTemplate += '<input placeholder="Name" type="text" ui-keyup="{\'enter\':\'addItem(child)\'}" ' + 'class="input-small addItemKeyInput" ng-model="$parent.keyName" />';
            }
            addItemTemplate +=
            // value type dropdown
            '<select ng-model="$parent.valueType" ng-options="option for option in valueTypes"' + 'ng-init="$parent.valueType=\'' + stringName + '\'" ui-keydown="{\'enter\':\'addItem(child)\'}"></select>' +
            // input value
            '<span ng-show="$parent.valueType == \'' + stringName + '\'"> : <input type="text" placeholder="Value" ' + 'class="input-medium addItemValueInput" ng-model="$parent.valueName" ui-keyup="{\'enter\':\'addItem(child)\'}"/></span> ' +
            // Add button
            '<button class="btn btn-primary" ng-click="addItem(child)">Add</button> ' + '<button class="btn" ng-click="$parent.showAddKey=false">Cancel</button>' + '</span>' + '<span ng-switch-default>' +
            // plus button
            '<button class="addObjectItemBtn" ng-click="$parent.showAddKey = true"><i class="glyphicon glyphicon-plus"></i></button>' + '</span>' + '</div>';

            // start template
            var template;
            if (scope.type === 'object') {
                template = '<i ng-click="toggleCollapse()" ng-class="chevron"' + ' ng-init="initToggle()"></i>' + '<span ng-class="{invisible: chevron == \'glyphicon glyphicon-chevron-down\'}" class="jsonItemDesc">' + objectName + '</span>' + '<div class="jsonContents" ng-if="!collapsed">' +
                // repeat
                '<span class="block" ng-hide="key.indexOf(\'_\') == 0" ng-repeat="(key, val) in child">' +
                // object key
                /*'<span ng-class="{\'alert-danger\': hasAssertionFailed(key) || hasChildAssertionFailed}"' +*/
                '<span class="jsonObjectKey">';

                /*template += '<span class="alert-danger" ng-show="hasAssertionFailed(key) || hasChildAssertionFailed">*&nbsp;</span>';*/

                template += '<input ng-if="editable==true" ng-check="isFlagged" class="json-checkbox" type="checkbox" name value ng-change="flagKey(child, key)" ng-model="flagged" ng-init="flagged = checkAssertion(child, key)"  />';

                template += '<input ng-class="{\'text-danger\': hasAssertionFailed(key) || hasChildAssertionFailed}" ng-disabled="editable==false" class="keyinput" type="text" ng-model="newkey" ng-init="newkey=key" ng-change="moveKey(child, key, newkey)"/>' +
                // delete button
                '<i class="deleteKeyBtn glyphicon glyphicon-trash" ng-if="editable==true" ng-click="deleteKey(child, key)"></i>' + '</span>' +
                // object value
                '<span class="jsonObjectValue">' + switchTemplate + '</span>' + '</span></span>';
                // repeat end
                if (scope.editable) {
                    template += addItemTemplate;
                }
                template += '</div>';
            } else if (scope.type === 'array') {
                template = '<i ng-click="toggleCollapse()" ng-class="chevron" ng-init="initToggle()"></i>' + '<span ng-class="chevron" class="jsonItemDesc">' + arrayName + '</span>' + '<div class="jsonContents" ng-if="!collapsed">' + '<ol class="arrayOl" ui-multi-sortable ng-model="child">' +
                // repeat
                '<li class="arrayItem" ng-repeat="val in child">' +
                // delete button
                '<i class="deleteKeyBtn glyphicon glyphicon-trash" ng-click="deleteKey(child, $index)"></i>' + '<i class="moveArrayItemBtn fa fa-bars"></i>' + '<span>' + switchTemplate + '</span>' + '</li>' +
                // repeat end
                '</ol>';

                if (scope.editable) {
                    template += addItemTemplate;
                }

                template += '</div>';
            } else {
                console.error('scope.type was ' + scope.type);
            }

            var newElement = angular.element(template);
            $compile(newElement)(scope);
            element.replaceWith(newElement);
        }
    };
});
