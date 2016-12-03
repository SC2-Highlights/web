App.controller('replayController', function($sce, $scope, $location, $rootScope, $route, Upload, configService) {

  $scope.submitReplay = function(data, replay) {
    Upload.upload({
      url: configService.api_url + '/submitreplay',
      header: { 'Content-Type': replay.type },
      method: 'POST',
      data: data,
      file: replay
    }).success(function(data) {
      $scope.success = true;
      $scope.data = data;
    }).error(function(data) {
      $scope.success = false;
      $scope.data = data;
    });
  };

  $scope.sendAnotherReplay = function() {
    $route.reload();
  };
});
