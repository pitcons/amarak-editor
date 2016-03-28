app.service('multipartForm', ['$http', function($http) {
    this.post = function(uploadUrl, data, successCallback) {
        var fd = new FormData();
        for (var key in data) {
            fd.append(key, data[key]);
        }
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined}
        }).then(successCallback);
    }
}]);
