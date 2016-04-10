
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

app.config([
  '$routeProvider',
  '$locationProvider',
  '$interpolateProvider',
  function($routeProvider, $locationProvider, $interpolateProvider) {
    // $interpolateProvider.startSymbol('{[');
    // $interpolateProvider.endSymbol(']}')

    $routeProvider.when("/schemes/:schemeId/concepts/:conceptName/", {
      name: "scheme.concept",
      templateUrl: "/concept_content",
      controller: "conceptController"
    }).when("/schemes/:id", {
      name: 'scheme',
      templateUrl: "/scheme_content",
      controller: "schemeController",
      resolve: {
        currentScheme: function($route, schemesService) {
          return schemesService.get($route.current.params.id);
        }
      }
    }).when("/search/", {
      name: 'start_search',
      templateUrl: "/search",
      controller: "searchController"
    }).when("/search/:q", {
      name: 'search',
      templateUrl: "/search",
      controller: "searchController"
    }).when("/import/", {
      name: 'import',
      templateUrl: "/import",
      controller: "importController"
    }).when("/export/:q", {
      name: 'export',
      templateUrl: "/export",
      controller: "exportController"
    }).otherwise({
      redirectTo: '/'
    });
}])
