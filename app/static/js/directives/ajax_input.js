app.directive('ajaxInput', function($http, $timeout) {
    function link(scope, element, attrs) {
        scope.$watch('value', function(value){
            if(value){
                scope.origValue = value;
                scope.currentValue = value;
            }
        });

        scope.$watch('currentValue', function() {
            var el = $(element);
            if (scope.currentValue === scope.origValue) {
                el.find('.is-buttons').addClass('ng-hide');
                el.find('.wrap').removeClass('input-group');
            } else {
                el.find('.is-buttons').removeClass('ng-hide');
                el.find('.is-buttons').find('.is-update').removeClass('ng-hide');
                el.find('.is-buttons').find('.is-reset').removeClass('ng-hide');

                el.find('.wrap').addClass('input-group');
            }
        });

        scope.send = function() {
            if (scope.currentValue !== scope.origValue) {
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
            value: '=?',
        },
        replace: true,
        templateUrl: "/static/templates/ajax_input.html"
    };
});
