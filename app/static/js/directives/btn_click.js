app.directive('btnClick', function($http, $timeout) {

    function link(scope, element, attr) {
        element.bind('click', function() {
            var isConfirmed = true;

            if (attr['btnConfirm']) {
                isConfirmed = confirm(attr['btnConfirm']);
            }
            if (attr['btnEconfirm']) {
                isConfirmed = confirm(scope.$eval(attr['btnEconfirm']));
            }

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
