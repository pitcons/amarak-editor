app.controller('importController', function($scope, multipartForm, cfg) {

    $scope.fileForImport = {};
    $scope.errors = [];

    $scope.startImport = function(){
        var uploadUrl = '/do_import';

        $scope.errors = [];

        multipartForm.post(
            uploadUrl,
            $scope.fileForImport,
            function(response){
                $scope.errors = response.data.errors;
            }
        );
    };

    /*
    $scope.startImport = function() {
        var f = document.getElementById('fileForImport').files[0],
            r = new FileReader();

        r.onloadend = function(e){
            $http({
                method: 'POST',
                data: e.target.result,
                url: '/do_import',
            }).success(function(data, status, headers, config) {

            }).error(function(data, status, headers, config) {
                console.log(status + headers);
            });

        }
        r.readAsBinaryString(f);
    }
    */
});
