var app = angular.module('amarakEditor', ['ui.bootstrap', 'ngRoute', ])
    .directive('ngEnter', function() {
        return function(scope, element, attrs) {
            element.bind("keydown keypress", function(event) {
                if(event.which === 13) {
                    scope.$apply(function(){
                        scope.$eval(attrs.ngEnter, {'event': event});
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .constant('cfg', {
        baseUrl: 'http://127.0.0.1:8000'
    })

/*
    .factory('amarakApi', function($http, $q, cfg) {
        var getSchemes = $q(function(resolve, reject){
            console.log('SERVIE START');
            $http({
                url: cfg.baseUrl + '/schemes/'
            }).success(function(data, status, headers, config) {
                resolve(data);
            }).error(function(data, status, headers, config) {
                reject(status + headers);
                //console.log(status + headers);
            });
        });
        return {
            getSchemes: getSchemes
        };
    });
*/

app.config(function($routeProvider){
  $routeProvider.when("/schemes/:thesaurus/term/:term",
    {
      templateUrl: "/term_content",
      controller: "TermController"
    }
  ).when("/schemes/:scheme/concept/:concept/",
    {
      templateUrl: "/concept_content",
      controller: "conceptController"
    }
  ).when("/schemes/:name",
    {
      templateUrl: "/scheme_content",
      controller: "schemeController"
    }
  ).when("/search/",
    {
      templateUrl: "/search",
      controller: "searchController"
    }
  ).when("/search/:q",
    {
      templateUrl: "/search",
      controller: "searchController"
    }
  ).when("/import/:q",
    {
      templateUrl: "/import",
      controller: "importController"
    }
  ).when("/export/:q",
    {
      templateUrl: "/export",
      controller: "exportController"
    }
  ).otherwise({
      redirectTo: '/'
  });
})


app.run(function($rootScope, $http, $q, $timeout, $location, cfg) {
    // $rootScope.base_url = 'http://127.0.0.1:8000';
    $rootScope.thesaurus = {};
    $rootScope.thesaurusTopTerms = {};
    $rootScope.termRelations = {};
    $rootScope.lang = 'ru';
    $rootScope.loadingIsDone = false;

    $rootScope.getSchemeTitle = function(scheme) {
        return scheme.labels[$rootScope.lang] || scheme.prefix;
    }

    $rootScope.update = function(scope, url, data, destModel, sourceModel, idWrap) {
        $('#' + idWrap).find('.is-refresh').removeClass('ng-hide');
        $('#' + idWrap).find('.is-update').addClass('ng-hide');
        $('#' + idWrap).find('.is-reset').addClass('ng-hide');

        $http({
            method: 'PUT',
            url: url,
            data: data,
        }).success(function(data, status, headers, config) {
            $timeout(function() {
                $('#' + idWrap).find('.is-refresh').addClass('ng-hide');
                $('#' + idWrap).find('.is-update').removeClass('ng-hide');
                $('#' + idWrap).find('.is-reset').removeClass('ng-hide');

                $('#' + idWrap).find('.is-buttons').addClass('ng-hide');
                $('#' + idWrap).removeClass('input-group');
            }, 1000); // TODO place for optimization ;)

            scope.$eval(sourceModel + ' = ' + destModel);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $rootScope.loadSchemes = function() {
        return $http({
            url: cfg.baseUrl + '/schemes/'
        }).success(function(data, status, headers, config) {
            $rootScope.schemes = data;
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $rootScope.loadConcept = function (scheme, concept) {
        $http({
            url: cfg.baseUrl + '/schemes/' + scheme + '/concepts/' + concept,
            data: {'flat_labels': 'True'}
        }).success(function(data, status, headers, config) {
            $rootScope.concept = data;
            console.log($rootScope.concept);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $rootScope.newConcept = function(scheme){
        var newName = 'new-' + Math.floor((Math.random() * 10000) + 1);
        $http({
            method: 'PUT',
            url: cfg.baseUrl + '/schemes/' + scheme + '/concepts/' + newName,
        }).success(function(data, status, headers, config) {
            $location.url('schemes/' + scheme + '/concepts/' + newName);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });

    }

    // Удаление схемы
    $rootScope.delConcept = function(scheme, uri) {
        if (confirm("Are you sure wan to delete this concept?") == true) {
            $http({
                method: 'DELETE',
                url: cfg.baseUrl + '/schemes/' + scheme + '/concepts/' + uri
            }).success(function(data, status, headers, config) {
                $location.path('/schemes/' + scheme);
            }).error(function(data, status, headers, config) {
                console.log(status + headers);
            });
        }
    }

    $rootScope.newScheme = function() {
        var newName = 'new-' + Math.floor((Math.random() * 10000) + 1);
        $http({
            method: 'PUT',
            url: cfg.baseUrl + '/schemes/' + newName,
        }).success(function(data, loadSchemesstatus, headers, config) {
            $rootScope.loadSchemes();
            $location.url('schemes/' + newName);
        }).error(function(data, status, headers, config) {
            console.log(status + headers);
        });
    }

    $rootScope.firstOfHash = function(ahash) {
        for (var firstKey in ahash) {
            return firstKey
        }
    }
    $rootScope.isObject = function ( obj ) {
        return typeof obj === "object";
    }

    $rootScope.defAjaxInput = function (scope, destModel, sourceModel, idWrap) {
        scope.$watch(destModel + ' + ' + sourceModel, function() {
            if (scope.$eval(destModel) && scope.$eval(sourceModel)) {
                if (scope.$eval(destModel) === scope.$eval(sourceModel)) {
                    $('#' + idWrap).find('.is-buttons').addClass('ng-hide');
                    $('#' + idWrap).removeClass('input-group');
                } else {
                    $('#' + idWrap).find('.is-buttons').removeClass('ng-hide');
                    $('#' + idWrap).find('.is-buttons').find('.is-update').removeClass('ng-hide');
                    $('#' + idWrap).find('.is-buttons').find('.is-reset').removeClass('ng-hide');

                    $('#' + idWrap).addClass('input-group');
                }
            }
        });
    }

    $rootScope.goSearch = function() {
        $location.url('search/' + $('#input-search').val());
    }

    $rootScope.exportScheme = function(scheme, format) {
        window.open(cfg.baseUrl + '/export/' + scheme + '/' + format, '_blank');
    }

    $rootScope.loadSchemes();

    // var mytimeout = $timeout(function(){
    //     console.log('$rootScope.schemes');
    // }, 100);



    // while(!$rootScope.schemes){
    //     console.log($rootScope.schemes);
    // }
});



app.controller('inlineEditController', function($scope) {
    $scope.init = function(some) {
        $scope.content = some;
        console.log(some);
    };
});
