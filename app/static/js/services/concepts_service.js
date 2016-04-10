app.factory('conceptsService', function(cfg, $http, $q) {
  // var schemes;
  return {
    get: function(schemeId, conceptId) {
      var deferred = $q.defer();

      $http({
        url: cfg.baseUrl + '/schemes/' + schemeId + '/concepts/' + conceptId,
        params: {id: schemeId}
      }).success(function(data, status, headers, config) {
        var concept = data;
        deferred.resolve(concept);
        return concept;
      }).error(function(data, status, headers, config) {
        console.log(status + headers);
        deferred.reject();
      });

      return deferred.promise;
    },
    create: function(schemeId) {
      var deferred = $q.defer();

      var newName = 'new-' + Math.floor((Math.random() * 10000) + 1);
      $http({
        method: 'PUT',
        url: cfg.baseUrl + '/schemes/' + schemeId + '/concepts/' + newName,
      }).success(function(data, status, headers, config) {
        deferred.resolve(newName);
        return newName;
      }).error(function(data, status, headers, config) {
        console.log(status + headers);
        deferred.reject();
      });

      return deferred.promise;
    },
    remove: function(schemeId, conceptName) {
      var deferred = $q.defer();

      $http({
        method: 'DELETE',
        url: cfg.baseUrl + '/schemes/' + schemeId + '/concepts/' + conceptName
      }).success(function(data, status, headers, config) {
        deferred.resolve();
      }).error(function(data, status, headers, config) {
        console.log(status + headers);
        deferred.reject();
      });

      return deferred.promise;
    },
    labels: {
      add: function(schemeId, conceptName, label) {
        var deferred = $q.defer();

        $http({
          method: 'PUT',
          url: cfg.baseUrl + '/schemes/' + schemeId +
              '/concepts/' + conceptName +
              '/labels/',
         data: label
        }).success(function(data, status, headers, config) {
          deferred.resolve();
        }).error(function(data, status, headers, config) {
          console.log(status + headers);
          deferred.reject();
        });

        return deferred.promise;
      },
      remove: function(schemeId, conceptName, labelId) {
        var deferred = $q.defer();

        $http({
          method: 'DELETE',
          url: cfg.baseUrl +
              '/schemes/' + schemeId +
              '/concepts/' + conceptName +
              '/labels/' + labelId
        }).success(function(data, status, headers, config) {
          deferred.resolve();
        }).error(function(data, status, headers, config) {
          console.log(status + headers);
          deferred.reject();
        });

        return deferred.promise;
      }
    }
  }

});
