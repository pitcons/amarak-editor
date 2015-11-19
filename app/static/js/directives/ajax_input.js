app.directive('ajaxInput', function($http, $timeout) {
    function link(scope, element, attrs) {
        console.log('link');
        scope.currentValue = scope.value;
        console.log(scope.label + ' value ' + scope.value);
        scope.$watch('currentValue + model', function() {
            if (scope.currentValue === scope.value) {
                $(element).find('.is-buttons').addClass('ng-hide');
                $(element).find('.wrap').removeClass('input-group');
            } else {
                $(element).find('.is-buttons').removeClass('ng-hide');
                $(element).find('.is-buttons').find('.is-update').removeClass('ng-hide');
                $(element).find('.is-buttons').find('.is-reset').removeClass('ng-hide');

                $(element).find('.wrap').addClass('input-group');
            }
        });
        scope.send = function() {
            if (scope.currentValue !== scope.value) {
                //$(element).find('.is-refresh').removeClass('ng-hide');
                //$(element).find('.is-update').addClass('ng-hide');
                //$(element).find('.is-reset').addClass('ng-hide');

                var data = {};
                data[scope.key] = scope.currentValue;

                $http({
                    method: scope.method,
                    url: scope.url,
                    data: data,
                }).success(function(data, status, headers, config) {
                    $timeout(function() {
                        $(element).find('.is-refresh').addClass('ng-hide');
                        $(element).find('.is-update').removeClass('ng-hide');
                        $(element).find('.is-reset').removeClass('ng-hide');

                        $(element).find('.is-buttons').addClass('ng-hide');
                        $(element).find('.wrap').removeClass('input-group');
                    }, 1000); // TODO place for optimization ;)

                    scope.model = scope.currentValue;
                    scope.value = scope.currentValue;
                }).error(function(data, status, headers, config) {
                    console.log(scope.url + ' returned status ' + status);
                });
            }
        };
    };

    return {
        link: link,
        restrict: 'E',
        scope: {
            url: '=',
            method: '@',
            key: '@',
            label: '=',
            value: '=',
        },
        replace: true,
        templateUrl: "/static/templates/ajax_input.html"
    };
});
