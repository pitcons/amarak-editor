app.directive('ajaxInput', function($http, $timeout) {
    function link(scope, element, attrs) {

        if (scope.autoEdit == undefined) {
            scope.autoEdit = true;
        }

        scope.data = {
            origValue: undefined,
            currentValue: undefined,
            isEditMode: scope.autoEdit
        }

        scope.toggleEditMode = function(isBlur) {

            if (scope.data.isEditMode) {
                if (!isBlur || scope.data.currentValue === scope.data.origValue) {
                    scope.data.isEditMode = scope.autoEdit;
                }
            } else {
                scope.data.isEditMode = true;
                var el = $(element);
                $timeout(function() {
                    el.find('input').focus();
                });
            }
        }

        scope.$watch('value', function(value){
            if(value){
                scope.data.origValue = value;
                scope.data.currentValue = value;
            }
        });

        scope.$watch('data.currentValue', function() {
            var el = $(element);
            if (scope.data.currentValue === scope.data.origValue) {
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
            if (scope.data.currentValue !== scope.data.origValue) {
                var data = {};
                data[scope.key] = scope.data.currentValue;

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

                    scope.value = scope.data.currentValue;
                    scope.toggleEditMode();
                }).error(function(data, status, headers, config) {
                    console.log(scope.url + ' returned status ' + status);
                });
            }
        };

        scope.reset = function() {
            scope.data.currentValue = scope.value;
            scope.toggleEditMode(true)
        }

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
            autoEdit: '=?'
        },
        replace: true,
        templateUrl: "/static/templates/ajax_input.html"
    };
});
