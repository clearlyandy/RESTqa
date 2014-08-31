'use strict';

angular.element(document).ready(function() {
    //Fixing facebook bug with redirect
    if (window.location.hash === '#_=_') window.location.hash = '#!';

    //Then init the app
    angular.bootstrap(document, ['mean']);

});

// Dynamically add angular modules declared by packages
var packageModules = [];
for (var index in window.modules) {
    angular.module(window.modules[index].module, window.modules[index].angularDependencies || []);
    packageModules.push(window.modules[index].module);
}

// Default modules
var modules = ['ngCookies', 'ngResource', 'ngRoute', 'ui.bootstrap', 'ui.router', 'ui.tree', 'angular-carousel'];
modules = modules.concat(packageModules);

var app = angular.module('mean', modules);

// fix ui-multi-sortable to y-axis
app.value('ui.config', {
    'sortable': {
        'axis': 'y',
        'placeholder': 'sortable-placeholder'
    }
});

// override the default input to update on blur
// from http://jsfiddle.net/cn8VF/
app.directive('ngModelOnblur', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, elm, attr, ngModelCtrl) {
            if (attr.type === 'radio' || attr.type === 'checkbox') return;

            elm.unbind('input').unbind('keydown').unbind('change');
            elm.bind('blur', function() {
                scope.$apply(function() {
                    ngModelCtrl.$setViewValue(elm.val());
                });
            });
        }
    };
});