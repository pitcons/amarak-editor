app.controller('searchController', function($scope, $rootScope, $http, $routeParams, $location, $timeout) {
    $scope.search = $routeParams['q'];
    $scope.searchResult = [];
    $scope.scheme = 'rutez';

    // Добавление схемы в иерархию
    $scope.searchConcepts = function () {
        $('#search-loading').removeClass('ng-hide');
        $http({
            method: 'GET',
            url: $scope.base_url + '/search/' + $scope.search
        }).success(function(data, status, headers, config) {
            $scope.searchResult = data;
            $timeout(function() {
                $('#search-loading').addClass('ng-hide');
            }, 1000);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
            $('#search-loading').addClass('ng-hide');
        });
    }
    if ($routeParams['q']) {
        $scope.searchConcepts();
    }
});
