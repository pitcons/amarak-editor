app.factory('schemesService', function(cfg, $http, $q) {
    // var schemes;

    return {
        get: function(schemeId) {
            var deferred = $q.defer();

            $http({
                url: cfg.baseUrl + '/schemes/',
                params: {id: schemeId}
            }).success(function(data, status, headers, config) {
                var scheme = data['schemes'][0];
                deferred.resolve(scheme);
                return scheme;
            }).error(function(data, status, headers, config) {
                console.log(status + headers);
                deferred.reject();
            });

            return deferred.promise;
        },
        all: function() {
            var deferred = $q.defer();

            $http({
                url: cfg.baseUrl + '/schemes/',
            }).success(function(data, status, headers, config) {
                var schemes = {};
                angular.forEach(data.schemes, function(value, key) {
                    schemes[value.id] = value;
                });

                deferred.resolve(schemes);
                return schemes;
            }).error(function(data, status, headers, config) {
                console.log(status + headers);
                deferred.reject();
            });

            return deferred.promise;

        }

    }
});
