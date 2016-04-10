var app = angular.module('amarakEditor', ['ui.bootstrap', 'ngRoute' ])
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .constant('cfg', {
        baseUrl: 'http://127.0.0.1:8000'
    })
