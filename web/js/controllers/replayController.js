
App.controller('replayController', function($sce, $scope, $location, $rootScope, Upload, configService) {

    $scope.submitReplay = function (data, replay) {
        Upload.upload({
            url: configService.api_url + '/submitreplay',
            header: {'Content-Type': replay.type},
            method: 'POST',
            data: data,
            file: replay
        }).success(function(data) {
            var response = angular.fromJson(data);

            $scope.message = response.message;
            $scope.success = response.success;
        });
    };
});
