var uritimeit = "../../laravel/public";

var app = angular.module("myApp", ['ngRoute','ngTable']);
var app2 = angular.module("myApp2", ['ngRoute']);

app.directive('onFinishRender', function ($timeout) {
    return {
        restrict: 'A',
        link: function (scope, element, attr) {
            if (scope.$last === true) {
                $timeout(function () {
                    scope.$emit('ngRepeatFinished');
                });
            }
        }
    }
});

app.config(function($routeProvider) {
  $routeProvider
   .when('/afiliado', {
    controller: 'afiliadoCtr',
    templateUrl: 'views/afiliado.html'
  })
   .when('/acta', {
    controller: 'actaCtr',
    templateUrl: 'views/acta.html'
  })
  .otherwise({
    redirectTo: '/afiliado'
  });
});


function isEmpty(obj) {
  // null and undefined are "empty"
  if (obj == null) return true;
  // Assume if it has a length property with a non-zero value
   // that that property is correct.
   if (obj.length > 0)    return false;
   if (obj.length === 0)  return true;
   // Otherwise, does it have any properties of its own?
    // Note that this doesn't handle
    // toString and valueOf enumeration bugs in IE < 9
    for (var key in obj) {
      if (hasOwnProperty.call(obj, key)) return false;
    }
    return true;
};