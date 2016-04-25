var uritimeit = "../../laravel/public";
var uri = "../public"
var cumpleanos = "N";

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

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            
            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);

app.directive('numbersOnly', function () {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function (scope, element, attrs, ctrl) {
            var validateNumber = function (inputValue) {
                var maxLength = 20;
                if (attrs.max) {
                    maxLength = attrs.max;
                }
                if (inputValue === undefined) {
                    return '';
                }
                var transformedInput = inputValue.replace(/[^0-9]/g, '');
                if (transformedInput !== inputValue) {
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                if (transformedInput.length > maxLength) {
                    transformedInput = transformedInput.substring(0, maxLength);
                    ctrl.$setViewValue(transformedInput);
                    ctrl.$render();
                }
                var isNotEmpty = (transformedInput.length === 0) ? true : false;
                ctrl.$setValidity('notEmpty', isNotEmpty);
                return transformedInput;
            };

            ctrl.$parsers.unshift(validateNumber);
            ctrl.$parsers.push(validateNumber);
            attrs.$observe('notEmpty', function () {
                validateNumber(ctrl.$viewValue);
            });
        }
    };
});

app.service('documentosService', ['$http', function ($http) {
    this.uploadFileToUrl = function(fd){
        var req = $http.post(uri + "/Afiliado/upload", fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        });
        return req;
    };
    this.verDocumento = function(obj){
        var req = $http.post(uri + "/Afiliado/Documento", obj);
        return req;
    }
}]);

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
