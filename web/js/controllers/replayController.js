
App.controller('replayController', function($sce, $scope, $location, $rootScope, Upload) {

    $scope.submitReplay = function (data, replay) {
        Upload.upload({
            url: 'http://api.sc2hl.com/submitreplay',
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
