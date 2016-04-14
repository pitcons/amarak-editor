app.run(function($rootScope, $window, $http, $q, $timeout, $location, cfg, reverseUrlService, schemesService, conceptsService) {

  $rootScope.thesaurus = {};
  $rootScope.thesaurusTopTerms = {};
  $rootScope.termRelations = {};
  $rootScope.lang = 'ru';
  $rootScope.loadingIsDone = false;
  $rootScope.schemesService = schemesService;
  $rootScope.conceptsService = conceptsService;

  $rootScope.reverse = reverseUrlService.reverse;

  $rootScope.open = function(name, mapping) {
    $window.location.href = $rootScope.reverse(name, mapping);
  }

  $rootScope.loadSchemes = function loadSchemes() {
    schemesService.all().then(function(schemes) {
      $rootScope.schemes = schemes;
    });
  }

  $rootScope.loadSchemes();

  $rootScope.getSchemeTitle = function(scheme) {
    return scheme.labels[$rootScope.lang] || scheme.id;
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
  $rootScope.isObject = function (obj) {
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
    // window.open(cfg.baseUrl + '/export/' + scheme + '/' + format, '_blank');
    window.open('/do_export/' + scheme + '/' + format, '_blank');
  }

});
