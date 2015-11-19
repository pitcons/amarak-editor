app.controller('conceptController', function($scope, $rootScope, $http, $routeParams, $location, cfg) {
    $scope.scope = $scope;
    $scope.scheme = $routeParams['scheme'];
    $scope.conceptUri = $routeParams['concept'];
    $scope.newConcept = {
        'relation': 'ВЫШЕ'
    }
    $scope.newConceptLabel = {
        'lang': 'ru',
        'type': 'altLabel',
        'label': ''
    }

    // Добавление label для концепта
    $scope.addConceptLabel = function() {
        $http({
            method: 'PUT',
            url: cfg.baseUrl + '/schemes/' + $scope.scheme + '/concepts/' + $scope.conceptUri +
                '/label/' + $scope.newConceptLabel.lang + '/' + $scope.newConceptLabel.type + '/' + $scope.newConceptLabel.label,
        }).success(function(data, status, headers, config) {
            $rootScope.loadConcept($scope.scheme, $scope.conceptUri);
            $scope.newConceptLabel.label = '';
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    // Удаление label для концепта
    $scope.delConceptLabel = function(concept_uri, lang, type, label) {
        $http({
            method: 'DELETE',
            url: cfg.baseUrl + '/schemes/' + $scope.scheme + '/concepts/' + concept_uri +
                '/label/' + lang + '/' + type + '/' + label,
        }).success(function(data, status, headers, config) {
            $rootScope.loadConcept($scope.scheme, $scope.conceptUri);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $scope.getConcepts = function(scheme, uri) {
        return $http.get(cfg.baseUrl + '/schemes/' + scheme + '/search/name/' + uri + '?limit=20')
            .then(function(response){
                return response.data['concepts'].map(function(item){
                    return item;
                });
        });
    };

    $scope.$watch("conceptUri", function(newUri, oldUri){
        if (newUri != oldUri) {
            $location.path('/schemes/' + $scope.scheme + '/concepts/' + newUri + '/');
        }
    });

    $scope.addLink = function() {
        console.log($scope.newRelation);
        console.log($scope.newRelation.concept);
        $http({
            method: 'PUT',
            url: cfg.baseUrl + '/schemes/' + $scope.scheme + '/add/relation' +
                '/' + 'rutez' + '/' + $scope.newRelation.relation +
                '/concept1/schemestub/' + $scope.conceptUri +
                '/concept2/' + $scope.newRelation.concept.scheme +'/' + $scope.newRelation.concept.uri
        }).success(function(data, status, headers, config) {
            $rootScope.loadConcept($scope.scheme, $scope.conceptUri);
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
            $rootScope.loadConcept($scope.scheme, $scope.conceptUri);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });

    }
    /*
    $scope.delLink = function(linkId) {
        console.log(cfg.baseUrl + '/link/' + linkId);
        $http({
            method: 'DELETE',
            url: cfg.baseUrl + '/link/' + linkId
        }).success(function(data, status, headers, config) {
            $rootScope.loadConcept($scope.scheme, $scope.conceptUri);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }
    */

    $rootScope.loadConcept($scope.scheme, $scope.conceptUri);

    // $scope.defAjaxInput($scope, 'formConceptUri', 'conceptUri', 'wrapConceptUri');
});
