app.controller('schemeController', function($scope, $rootScope, $http, $routeParams, $location, $timeout, cfg) {
    var self = this;
    $scope.cfg = cfg;
    $scope.scope = $scope;
    $scope.scheme = $routeParams['name'];

    $scope.$watch("schemes[scheme].name", function(newName, oldName) {
        console.log('change ' + oldName + ' ' + newName);
        if (oldName && newName && newName != oldName) {
            console.log('REDIRECT ' + newName);
            $location.path('/schemes/' + newName);
            $scope.scheme = newName;
            $scope.loadSchemes().then(function() {
                $location.path('/schemes/' + newName);
            });
        }
    });

    // Обновлние языка по-умолчанию для добавления label в схему
    $scope.$watch("schemes[scheme].langs", function(newName, oldName){
        if (!$scope.newSchemeLabelLang && $scope.scheme && $scope.schemes && $scope.schemes[$scope.scheme]) {
            $scope.newSchemeLabelLang = $scope.firstOfHash($scope.schemes[$scope.scheme].langs);
        }
    });

    // Обновление/добавление labels для схем
    $scope.addSchemeLabel = function() {
        var data = {'labels': {}};
        data['labels'][$scope.newSchemeLabelLang] = $scope.newSchemeLabel;

        $http({
            method: 'PUT',
            url: cfg.baseUrl + '/schemes/' + $scope.scheme,
            data: data
        }).success(function(data, status, headers, config) {
            $scope.newSchemeLabel = '';
            $rootScope.loadSchemes();
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    // Добавление схемы в иерархию
    $scope.addHierarhy = function () {
        $http({
            method: 'PUT',
            url: cfg.baseUrl + '/schemes/' + $scope.scheme + '/parent/' + $scope.newHierarhyPreifix
        }).success(function(data, status, headers, config) {
            $rootScope.loadSchemes();
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    // удаление иерархии и схемы
    $scope.delHierarhy = function(name) {
        $http({
            method: 'DELETE',
            url: cfg.baseUrl + '/schemes/' + $scope.scheme + '/parent/' + name
        }).success(function(data, status, headers, config) {
            $rootScope.loadSchemes();
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    // Удаление схемы
    $scope.delScheme = function() {
        if (confirm("Are you sure wan to delete this scheme?") == true) {
            $http({
                method: 'DELETE',
                url: cfg.baseUrl + '/schemes/' + $scope.scheme
            }).success(function(data, status, headers, config) {
                $rootScope.loadSchemes();
                $location.path('');
            }).error(function(data, status, headers, config) {
                console.log(status + headers);
            });
        }
    }

    // термины верхнего уровня
    $scope.getTopConcepts = function() {
        $http({
            method: 'GET',
            data: $rootScope.thesaurus,
            url: cfg.baseUrl + '/schemes/' + $scope.scheme + '/concepts/top'
        }).success(function(data, status, headers, config) {
            $scope.topConcepts = data['concepts'];
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $scope.getTopConcepts();

    // $scope.resetThesaururs = function() {
    //     var thesauruses = $rootScope.thesauruses;
    //     var name = $rootScope.openedThesaurus;
    //     $rootScope.thesaurus['name'] = thesauruses[name]['name'];
    //     $rootScope.thesaurus['title'] = thesauruses[name]['title'];
    // };


    // $scope.reload = function () {
    //     $http({
    //         url: cfg.baseUrl + '/thesauruses/'
    //     }).success(function(data, status, headers, config) {
    //         $rootScope.thesauruses = data;
    //         $rootScope.parents = $rootScope.thesauruses[$rootScope.openedThesaurus]['parents'];
    //         $scope.resetThesaururs();
    //     }).error(function(data, status, headers, config) {
    //         console.log(status + headers);
    //     });
    // }

    // $scope.submitThesaurus = function() {
    //     $http({
    //         method: 'PUT',
    //         data: $rootScope.thesaurus,
    //         url: cfg.baseUrl + '/thesaurus/' + $rootScope.openedThesaurus
    //     }).success(function(data, status, headers, config) {
    //         $rootScope.openedThesaurus = $rootScope.thesaurus['name'];
    //         $rootScope.thesauruses[$rootScope.openedThesaurus] = $rootScope.thesaurus;
    //         $location.path('/thesaurus/' + $rootScope.openedThesaurus);
    //     }).error(function(data, status, headers, config) {
    //         console.log(status + headers);
    //     });
    // }

    // $rootScope.openedThesaurus = $routeParams['name']

    // $scope.reload();
    // $scope.getTopTerms();

    // // new
    // console.log('load');

});
