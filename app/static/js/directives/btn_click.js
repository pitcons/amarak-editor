app.directive('btnClick', function($http, $timeout) {

    function link(scope, element, attr) {
        element.bind('click', function() {
            var isConfirmed = !attr['btnConfirm'] || confirm(attr['btnConfirm']);

            if(isConfirmed) {
                scope.$eval(attr['btnClick']).then(function() {
                    if (attr['btnAfter']) {
                        scope.$eval(attr['btnAfter']);
                    }
                });
            }
        });
    }

    return {
        link: link,
        restrict: 'A',
        scope: false
    };
});
