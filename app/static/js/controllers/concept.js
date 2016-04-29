app.controller('conceptController', function($scope, $rootScope, $http, $routeParams, $location, conceptsService, cfg) {
    $scope.scope = $scope;
    $scope.cfg = cfg;
    $scope.scheme = $routeParams['schemeId'];
    $scope.schemeId = $routeParams['schemeId'];
    $scope.conceptName = $routeParams['conceptName'];
    $scope.newConcept = {
        'relation': 'ВЫШЕ'
    }
    $scope.newConceptLabel = {
        'lang': 'ru',
        'type': 'altLabel',
        'literal': ''
    }

    $scope.newLabelClick = function() {
        $('#new-concept-label-btn').click();
    }

    $rootScope.loadConcept = function (scheme, concept) {
        $http({
            url: cfg.baseUrl + '/schemes/' + scheme + '/concepts/' + concept,
            data: {'flat_labels': 'True'}
        }).success(function(data, status, headers, config) {
            $rootScope.concept = data;
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $scope.$watch("conceptName", function(newUri, oldUri){
        if (newUri != oldUri) {
            $location.path('/schemes/' + $scope.scheme + '/concepts/' + newUri + '/');
        }
    });

    $scope.addLink = function() {
        $http({
            method: 'PUT',
            url: cfg.baseUrl + '/schemes/' + $scope.scheme + '/add/relation' +
                '/' + 'rutez' + '/' + $scope.newRelation.relation +
                '/concept1/schemestub/' + $scope.conceptName +
                '/concept2/' + $scope.newRelation.concept.scheme +'/' + $scope.newRelation.concept.uri
        }).success(function(data, status, headers, config) {
            $rootScope.loadConcept($scope.scheme, $scope.conceptName);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $scope.delLink = function(scheme, relscheme, relname, scheme1, concept1, scheme2, concept2) {
        $http({
            method: 'DELETE',
            url: cfg.baseUrl + '/schemes/' + scheme +
                '/link/' + relscheme + '/' + relname +
                '/concept1/' + scheme1 + '/' + concept1 +
                '/concept2/' + scheme2 + '/' + concept2
        }).success(function(data, status, headers, config) {
            $rootScope.loadConcept($scope.scheme, $scope.conceptName);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }


    $rootScope.loadConcept($scope.scheme, $scope.conceptName);

    // $scope.defAjaxInput($scope, 'formConceptUri', 'conceptName', 'wrapConceptUri');
});
