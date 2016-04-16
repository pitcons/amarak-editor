app.controller('schemeController', function($scope, $rootScope, $http, $routeParams, $location, $timeout, cfg, conceptsService, currentScheme) {
    var self = this;
    $scope.cfg = cfg;
    $scope.scope = $scope;
    $scope.schemeId = $routeParams['id'];
    $scope.currentScheme = currentScheme;
    $scope.conceptsService = conceptsService;

    $scope.reloadScheme = function() {
        $scope.schemesService.get($scope.schemeId).then(function(scheme){
            $scope.currentScheme = scheme;
        });
    }
    $scope.newRelationClick = function() {
        $('#new-relation-btn').click();
    }

    $scope.$watch("currentScheme.id", function(newName, oldName) {

        if (oldName && newName && newName != oldName) {

            $rootScope.schemes[newName] = $rootScope.schemes[oldName];
            $rootScope.schemes[oldName].id = newName;
            $scope.schemeId = newName;
            delete $rootScope.schemes[oldName];

            $location.path('/schemes/' + newName);
        }
    });

    $scope.addConcept = function() {
        conceptsService.create($scope.schemeId).then(
            function(conceptName) {
                $scope.open('scheme.concept',
                            {schemeId: $scope.schemeId,
                             conceptName: conceptName});
            });
    }

    $scope.removeConcept = function(schemeId, conceptName) {
        conceptsService.remove(schemeId, conceptName).then(
            function(conceptName) {
                $scope.open('scheme',
                            {schemeId: $scope.schemeId});
            });
    }


    // Обновление/добавление labels для схем
    $scope.addSchemeLabel = function() {
        // TODO implement
        alert('implement');
        /*
        $scope.currentScheme['labels'].push({
            'lang': $scope.schemeNewLabelLang,
            'type': 'prefLabel',
            'literal': $scope.newSchemeLabel
        })
        var data = {'labels': $scope.currentScheme['labels']};

        $http({
            method: 'PUT',
            url: cfg.baseUrl + '/schemes/' + $scope.schemeId,
            data: data
        }).success(function(data, status, headers, config) {
            $scope.newSchemeLabel = '';
            $rootScope.loadSchemes();
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });*/
    }

    // Добавление схемы в иерархию
    $scope.addHierarhy = function () {
        $http({
            method: 'PUT',
            url: cfg.baseUrl + '/schemes/' + $scope.schemeId + '/parent/' + $scope.newHierarhyPreifix
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
            url: cfg.baseUrl + '/schemes/' + $scope.schemeId + '/parent/' + name
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
                url: cfg.baseUrl + '/schemes/' + $scope.schemeId
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
            url: cfg.baseUrl + '/schemes/' + $scope.schemeId + '/concepts/top'
        }).success(function(data, status, headers, config) {
            $scope.topConcepts = data['concepts'];
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $scope.getTopConcepts();


});
