app.controller('ThController', function($scope, $rootScope, $http, $routeParams, $location) {
    var self = this;
    $scope.resetThesaururs = function() {
        var thesauruses = $rootScope.thesauruses;
        var name = $rootScope.openedThesaurus;
        $rootScope.thesaurus['name'] = thesauruses[name]['name'];
        $rootScope.thesaurus['title'] = thesauruses[name]['title'];
    };

    $scope.loadSchemes = function () {
        $http({
            url: $scope.base_url + '/schemes/'
        }).success(function(data, status, headers, config) {
            $rootScope.schemes = data;
            $rootScope.parents = $rootScope.thesauruses[$rootScope.openedThesaurus]['parents'];
            $scope.resetThesaururs();
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $scope.reload = function () {
        $http({
            url: $scope.base_url + '/thesauruses/'
        }).success(function(data, status, headers, config) {
            $rootScope.thesauruses = data;
            $rootScope.parents = $rootScope.thesauruses[$rootScope.openedThesaurus]['parents'];
            $scope.resetThesaururs();
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $scope.submitThesaurus = function() {
        $http({
            method: 'PUT',
            data: $rootScope.thesaurus,
            url: $scope.base_url + '/thesaurus/' + $rootScope.openedThesaurus
        }).success(function(data, status, headers, config) {
            $rootScope.openedThesaurus = $rootScope.thesaurus['name'];
            $rootScope.thesauruses[$rootScope.openedThesaurus] = $rootScope.thesaurus;
            $location.path('/thesaurus/' + $rootScope.openedThesaurus);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $scope.delHierarhy = function(e) {
        var name = $(e.target).data('name');

        $http({
            method: 'DELETE',
            data: $rootScope.thesaurus,
            url: $scope.base_url + '/thesaurus/' + $rootScope.openedThesaurus + '/parent/' + name
        }).success(function(data, status, headers, config) {
            $(e.target).parent().parent().remove(); // TODO
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }


    $scope.addHierarhy = function () {
        $http({
            method: 'PUT',
            url: $scope.base_url + '/thesaurus/' + $rootScope.openedThesaurus + '/parent/' + $scope.hierarhy.new
        }).success(function(data, status, headers, config) {
            $scope.reload();
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $scope.getTopTerms = function() {
        $http({
            method: 'GET',
            data: $rootScope.thesaurus,
            url: $scope.base_url + '/thesaurus/' + $rootScope.openedThesaurus + '/terms/top'
        }).success(function(data, status, headers, config) {
            $rootScope.thesaurusTopTerms[$rootScope.openedThesaurus] = data['terms'];
            $rootScope.topTerms = data['terms'];
            // console.log(data['terms']);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $rootScope.openedThesaurus = $routeParams['name']

    $scope.reload();
    $scope.getTopTerms();
});
